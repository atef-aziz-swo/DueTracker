import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors, spacing, typography, shadows} from '../utils/theme';
import {loadPayments, loadCategories} from '../services/storage';
import {Payment, Category} from '../types';
import {calculatePaymentStats, formatCurrency} from '../utils/helpers';
import {startOfMonth, endOfMonth, isWithinInterval, format} from 'date-fns';

export const ReportsScreen = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const loadedPayments = await loadPayments();
    const loadedCategories = await loadCategories();
    setPayments(loadedPayments);
    setCategories(loadedCategories);
  };

  const stats = calculatePaymentStats(payments);
  
  // Current month payments
  const currentMonthPayments = payments.filter(p =>
    isWithinInterval(new Date(p.dueDate), {
      start: startOfMonth(new Date()),
      end: endOfMonth(new Date()),
    })
  );

  const currentMonthStats = calculatePaymentStats(currentMonthPayments);

  const renderStatCard = (
    icon: string,
    label: string,
    value: string,
    subtitle?: string,
    color: string = colors.primary
  ) => (
    <View style={styles.statCard}>
      <Icon name={icon} size={32} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const renderCategoryCard = (category: Category) => {
    const categoryPayments = payments.filter(p => p.categoryId === category.id);
    const totalAmount = categoryPayments.reduce((sum, p) => sum + p.amount, 0);
    
    return (
      <View key={category.id} style={styles.categoryCard}>
        <View style={[styles.categoryDot, {backgroundColor: category.color}]} />
        <View style={styles.categoryInfo}>
          <Text style={styles.categoryName}>{category.name}</Text>
          <Text style={styles.categoryCount}>{categoryPayments.length} payments</Text>
        </View>
        <Text style={styles.categoryAmount}>{formatCurrency(totalAmount)}</Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overall Statistics</Text>
          <View style={styles.statsGrid}>
            {renderStatCard(
              'cash-multiple',
              'Total Amount',
              formatCurrency(stats.totalAmount),
              `${stats.total} payments`,
              colors.primary
            )}
            {renderStatCard(
              'alert-circle',
              'Overdue',
              formatCurrency(stats.overdueAmount),
              `${stats.overdue} payments`,
              colors.danger
            )}
          </View>
          <View style={styles.statsGrid}>
            {renderStatCard(
              'clock-outline',
              'Pending',
              formatCurrency(stats.pendingAmount),
              `${stats.pending} payments`,
              colors.warning
            )}
            {renderStatCard(
              'check-circle',
              'Paid',
              formatCurrency(stats.paidAmount),
              `${stats.paid} payments`,
              colors.success
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            This Month ({format(new Date(), 'MMMM yyyy')})
          </Text>
          <View style={styles.monthCard}>
            <View style={styles.monthStat}>
              <Text style={styles.monthLabel}>Total</Text>
              <Text style={styles.monthValue}>
                {formatCurrency(currentMonthStats.totalAmount)}
              </Text>
            </View>
            <View style={styles.monthStat}>
              <Text style={styles.monthLabel}>Payments</Text>
              <Text style={styles.monthValue}>{currentMonthStats.total}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>By Category</Text>
          {categories.map(renderCategoryCard)}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h2,
    fontSize: 22,
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    ...shadows.medium,
  },
  statValue: {
    ...typography.h2,
    fontSize: 20,
    marginTop: spacing.sm,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  statSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  monthCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-around',
    ...shadows.medium,
  },
  monthStat: {
    alignItems: 'center',
  },
  monthLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  monthValue: {
    ...typography.h2,
    fontSize: 24,
    marginTop: spacing.xs,
  },
  categoryCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.small,
  },
  categoryDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: spacing.md,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    ...typography.body,
    fontWeight: '600',
  },
  categoryCount: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  categoryAmount: {
    ...typography.h3,
    fontSize: 18,
    color: colors.primary,
  },
});
