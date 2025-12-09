import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors, spacing, typography, shadows} from '../utils/theme';
import {Payment, Category} from '../types';
import {loadPayments, loadCategories} from '../services/storage';
import {PaymentCard} from '../components/PaymentCard';
import {
  calculatePaymentStats,
  updatePaymentStatus,
  sortPaymentsByDate,
  getCategoryById,
  getUpcomingPayments,
} from '../utils/helpers';
import {useFocusEffect} from '@react-navigation/native';

export const DashboardScreen = ({navigation}: any) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const loadedPayments = await loadPayments();
      const loadedCategories = await loadCategories();
      
      // Update payment statuses
      const updatedPayments = loadedPayments.map(updatePaymentStatus);
      
      setPayments(sortPaymentsByDate(updatedPayments));
      setCategories(loadedCategories);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const stats = calculatePaymentStats(payments);
  const upcomingPayments = getUpcomingPayments(payments);

  const renderStatCard = (
    label: string,
    value: string,
    color: string,
    icon: string
  ) => (
    <View style={[styles.statCard, {borderLeftColor: color}]}>
      <Icon name={icon} size={24} color={color} />
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, {color}]}>{value}</Text>
    </View>
  );

  const renderPaymentItem = ({item}: {item: Payment}) => {
    const category = getCategoryById(categories, item.categoryId);
    if (!category) return null;

    return (
      <PaymentCard
        payment={item}
        category={category}
        onPress={() => navigation.navigate('PaymentDetail', {paymentId: item.id})}
      />
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            {renderStatCard('Total', `${stats.total}`, colors.primary, 'cash-multiple')}
            {renderStatCard('Overdue', `${stats.overdue}`, colors.danger, 'alert-circle')}
          </View>
          <View style={styles.statsRow}>
            {renderStatCard('Pending', `${stats.pending}`, colors.warning, 'clock-outline')}
            {renderStatCard('Paid', `${stats.paid}`, colors.success, 'check-circle')}
          </View>
        </View>

        {/* Upcoming Payments Section */}
        {upcomingPayments.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="calendar-alert" size={24} color={colors.warning} />
              <Text style={styles.sectionTitle}>Upcoming (Next 7 Days)</Text>
            </View>
            {upcomingPayments.slice(0, 3).map(payment => {
              const category = getCategoryById(categories, payment.categoryId);
              return category ? (
                <PaymentCard
                  key={payment.id}
                  payment={payment}
                  category={category}
                  onPress={() => navigation.navigate('PaymentDetail', {paymentId: payment.id})}
                />
              ) : null;
            })}
          </View>
        )}

        {/* Recent Payments Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="history" size={24} color={colors.primary} />
            <Text style={styles.sectionTitle}>Recent Payments</Text>
            {payments.length > 5 && (
              <TouchableOpacity onPress={() => navigation.navigate('AllPayments')}>
                <Text style={styles.viewAll}>View All</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {payments.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="receipt-text-outline" size={64} color={colors.disabled} />
              <Text style={styles.emptyText}>No payments yet</Text>
              <Text style={styles.emptySubtext}>
                Tap the + button to add your first payment
              </Text>
            </View>
          ) : (
            payments.slice(0, 5).map(payment => {
              const category = getCategoryById(categories, payment.categoryId);
              return category ? (
                <PaymentCard
                  key={payment.id}
                  payment={payment}
                  category={category}
                  onPress={() => navigation.navigate('PaymentDetail', {paymentId: payment.id})}
                />
              ) : null;
            })
          )}
        </View>
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddPayment')}
        activeOpacity={0.8}>
        <Icon name="plus" size={28} color={colors.surface} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  statsContainer: {
    padding: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    borderLeftWidth: 4,
    ...shadows.small,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  statValue: {
    ...typography.h2,
    fontSize: 24,
    marginTop: spacing.xs,
  },
  section: {
    padding: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    fontSize: 20,
    marginLeft: spacing.sm,
    flex: 1,
  },
  viewAll: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyText: {
    ...typography.h3,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  emptySubtext: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.large,
  },
});
