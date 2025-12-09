// Web-compatible storage using localStorage
import {Payment, Category, PaymentHistory, AppSettings} from '../types';

// Storage keys
const PAYMENTS_KEY = '@payments';
const CATEGORIES_KEY = '@categories';
const PAYMENT_HISTORY_KEY = '@payment_history';
const SETTINGS_KEY = '@settings';

// Default categories (similar to reference app)
export const defaultCategories: Category[] = [
  {id: '1', name: 'Home', parentId: null, color: '#4ade80'},
  {id: '2', name: 'Utilities', parentId: '1', color: '#60a5fa'},
  {id: '3', name: 'Rent', parentId: '1', color: '#f472b6'},
  {id: '4', name: 'Work', parentId: null, color: '#fbbf24'},
  {id: '5', name: 'Subscriptions', parentId: null, color: '#a78bfa'},
];

// Default settings
export const defaultSettings: AppSettings = {
  notifications: {
    enabled: true,
    defaultDaysBefore: 3,
    soundEnabled: true,
  },
  currency: '$',
  theme: 'auto',
};

// Payment operations
export const savePayments = async (payments: Payment[]): Promise<void> => {
  try {
    localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));
  } catch (error) {
    console.error('Error saving payments:', error);
    throw error;
  }
};

export const loadPayments = async (): Promise<Payment[]> => {
  try {
    const data = localStorage.getItem(PAYMENTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading payments:', error);
    return [];
  }
};

// Category operations
export const saveCategories = async (categories: Category[]): Promise<void> => {
  try {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  } catch (error) {
    console.error('Error saving categories:', error);
    throw error;
  }
};

export const loadCategories = async (): Promise<Category[]> => {
  try {
    const data = localStorage.getItem(CATEGORIES_KEY);
    if (data) {
      return JSON.parse(data);
    }
    // Initialize with default categories if none exist
    await saveCategories(defaultCategories);
    return defaultCategories;
  } catch (error) {
    console.error('Error loading categories:', error);
    return defaultCategories;
  }
};

// Payment History operations
export const savePaymentHistory = async (history: PaymentHistory[]): Promise<void> => {
  try {
    localStorage.setItem(PAYMENT_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving payment history:', error);
    throw error;
  }
};

export const loadPaymentHistory = async (): Promise<PaymentHistory[]> => {
  try {
    const data = localStorage.getItem(PAYMENT_HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading payment history:', error);
    return [];
  }
};

// Settings operations
export const saveSettings = async (settings: AppSettings): Promise<void> => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
    throw error;
  }
};

export const loadSettings = async (): Promise<AppSettings> => {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (data) {
      return JSON.parse(data);
    }
    await saveSettings(defaultSettings);
    return defaultSettings;
  } catch (error) {
    console.error('Error loading settings:', error);
    return defaultSettings;
  }
};

// Clear all data
export const clearAllData = async (): Promise<void> => {
  try {
    localStorage.removeItem(PAYMENTS_KEY);
    localStorage.removeItem(CATEGORIES_KEY);
    localStorage.removeItem(PAYMENT_HISTORY_KEY);
    localStorage.removeItem(SETTINGS_KEY);
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
};
