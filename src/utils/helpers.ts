import {Payment, Category} from '../types';
import {isAfter, isBefore} from 'date-fns';

// Generate unique ID
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Format currency
export const formatCurrency = (amount: number, currency: string = '$'): string => {
  return `${currency}${amount.toFixed(2)}`;
};

// Calculate total dues
export const calculateTotalDues = (payments: Payment[]): number => {
  return payments
    .filter(p => p.status === 'pending' || p.status === 'overdue')
    .reduce((total, p) => total + p.amount, 0);
};

// Update payment status based on date
export const updatePaymentStatus = (payment: Payment): Payment => {
  const now = new Date();
  const dueDate = new Date(payment.dueDate);
  
  if (payment.status === 'paid') {
    return payment;
  }

  if (isBefore(dueDate, now)) {
    return {...payment, status: 'overdue'};
  }

  return {...payment, status: 'pending'};
};

// Sort payments by date
export const sortPaymentsByDate = (payments: Payment[], ascending: boolean = true): Payment[] => {
  return [...payments].sort((a, b) => {
    const dateA = new Date(a.dueDate).getTime();
    const dateB = new Date(b.dueDate).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

// Filter payments by status
export const filterPaymentsByStatus = (
  payments: Payment[],
  status: 'pending' | 'paid' | 'overdue' | 'all'
): Payment[] => {
  if (status === 'all') {
    return payments;
  }
  return payments.filter(p => p.status === status);
};

// Filter payments by category
export const filterPaymentsByCategory = (
  payments: Payment[],
  categoryId: string
): Payment[] => {
  return payments.filter(p => p.categoryId === categoryId);
};

// Get category by ID
export const getCategoryById = (categories: Category[], categoryId: string): Category | undefined => {
  return categories.find(c => c.id === categoryId);
};

// Get all child categories
export const getChildCategories = (categories: Category[], parentId: string): Category[] => {
  return categories.filter(c => c.parentId === parentId);
};

// Calculate statistics
export interface PaymentStats {
  total: number;
  pending: number;
  overdue: number;
  paid: number;
  totalAmount: number;
  overdueAmount: number;
  pendingAmount: number;
  paidAmount: number;
}

export const calculatePaymentStats = (payments: Payment[]): PaymentStats => {
  return {
    total: payments.length,
    pending: payments.filter(p => p.status === 'pending').length,
    overdue: payments.filter(p => p.status === 'overdue').length,
    paid: payments.filter(p => p.status === 'paid').length,
    totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
    overdueAmount: payments
      .filter(p => p.status === 'overdue')
      .reduce((sum, p) => sum + p.amount, 0),
    pendingAmount: payments
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0),
    paidAmount: payments
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0),
  };
};

// Get upcoming payments (next 7 days)
export const getUpcomingPayments = (payments: Payment[]): Payment[] => {
  const now = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  return payments.filter(p => {
    const dueDate = new Date(p.dueDate);
    return isAfter(dueDate, now) && isBefore(dueDate, nextWeek) && p.status === 'pending';
  });
};
