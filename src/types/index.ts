// Core types for the DueTracker app - inspired by payment-dues-notifier

export interface Category {
  id: string;
  name: string;
  parentId: string | null;
  color: string;
}

export interface Payment {
  id: string;
  title: string;
  amount: number;
  dueDate: Date;
  categoryId: string;
  status: 'pending' | 'paid' | 'overdue';
  isRecurring: boolean;
  recurringInterval?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  isTemplate: boolean;
  notificationEnabled: boolean;
  notificationDays?: number; // Days before due date to send reminder
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentHistory {
  id: string;
  paymentId: string;
  amountPaid: number;
  paidDate: Date;
  notes?: string;
  createdAt: Date;
}

export interface NotificationSettings {
  enabled: boolean;
  defaultDaysBefore: number;
  soundEnabled: boolean;
}

export interface AppSettings {
  notifications: NotificationSettings;
  currency: string;
  theme: 'light' | 'dark' | 'auto';
}
