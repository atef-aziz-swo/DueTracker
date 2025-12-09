import PushNotification from 'react-native-push-notification';
import {Payment, Category} from '../types';
import {format, addDays, isBefore} from 'date-fns';

// Initialize push notifications
export const initializeNotifications = () => {
  PushNotification.configure({
    onRegister: function (token) {
      console.log('TOKEN:', token);
    },
    onNotification: function (notification) {
      console.log('NOTIFICATION:', notification);
    },
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    popInitialNotification: true,
    requestPermissions: true,
  });

  PushNotification.createChannel(
    {
      channelId: 'payment-reminders',
      channelName: 'Payment Reminders',
      channelDescription: 'Notifications for upcoming payment dues',
      playSound: true,
      soundName: 'default',
      importance: 4,
      vibrate: true,
    },
    (created) => console.log(`Channel created: ${created}`)
  );
};

// Schedule notification for a payment
export const schedulePaymentReminder = (
  payment: Payment,
  category: Category
): void => {
  if (!payment.notificationEnabled || !payment.notificationDays) {
    return;
  }

  const reminderDate = addDays(new Date(payment.dueDate), -payment.notificationDays);
  
  // Only schedule if reminder date is in the future
  if (isBefore(reminderDate, new Date())) {
    return;
  }

  const message = `Payment reminder: ${payment.title} - $${payment.amount} due on ${format(new Date(payment.dueDate), 'MMM dd, yyyy')}`;

  PushNotification.localNotificationSchedule({
    channelId: 'payment-reminders',
    title: 'Payment Due Reminder',
    message: message,
    date: reminderDate,
    allowWhileIdle: true,
    id: payment.id.hashCode(), // Convert string to number for notification ID
    userInfo: {paymentId: payment.id},
  });
};

// Cancel notification for a payment
export const cancelPaymentReminder = (paymentId: string): void => {
  PushNotification.cancelLocalNotification(paymentId.hashCode());
};

// Cancel all notifications
export const cancelAllNotifications = (): void => {
  PushNotification.cancelAllLocalNotifications();
};

// Reschedule all notifications (useful after app restart)
export const rescheduleAllNotifications = async (
  payments: Payment[],
  categories: Category[]
): Promise<void> => {
  cancelAllNotifications();
  
  payments.forEach(payment => {
    const category = categories.find(c => c.id === payment.categoryId);
    if (category && payment.status === 'pending') {
      schedulePaymentReminder(payment, category);
    }
  });
};

// Helper to convert string to hash code for notification IDs
declare global {
  interface String {
    hashCode(): number;
  }
}

String.prototype.hashCode = function(): number {
  let hash = 0;
  for (let i = 0; i < this.length; i++) {
    const char = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};
