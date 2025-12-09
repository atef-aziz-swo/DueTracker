// Web-compatible notifications using Web Notifications API
import {Payment, Category} from '../types';
import {format, addDays, isBefore} from 'date-fns';

// Initialize web notifications
export const initializeNotifications = () => {
  if ('Notification' in window) {
    Notification.requestPermission().then(permission => {
      console.log('Notification permission:', permission);
    });
  } else {
    console.log('This browser does not support notifications');
  }
};

// Schedule notification for a payment (web version uses browser notifications)
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

  // For web, we'll use setTimeout to schedule the notification
  const timeUntilReminder = reminderDate.getTime() - new Date().getTime();
  
  if (timeUntilReminder > 0) {
    setTimeout(() => {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Payment Due Reminder', {
          body: message,
          icon: '/favicon.ico',
          tag: payment.id,
        });
      }
    }, timeUntilReminder);
  }
};

// Cancel notification for a payment (web version)
export const cancelPaymentReminder = (paymentId: string): void => {
  // Web notifications can't be easily cancelled once scheduled with setTimeout
  // In production, you'd want to use a service worker for this
  console.log('Cancel notification for:', paymentId);
};

// Cancel all notifications (web version)
export const cancelAllNotifications = (): void => {
  console.log('Cancel all notifications');
};

// Reschedule all notifications (useful after app restart)
export const rescheduleAllNotifications = async (
  payments: Payment[],
  categories: Category[]
): Promise<void> => {
  payments.forEach(payment => {
    const category = categories.find(c => c.id === payment.categoryId);
    if (category && payment.status === 'pending') {
      schedulePaymentReminder(payment, category);
    }
  });
};
