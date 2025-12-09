import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Payment, Category} from '../types';
import {colors, spacing, typography, shadows} from '../utils/theme';
import {formatCurrency} from '../utils/helpers';
import {format} from 'date-fns';

interface PaymentCardProps {
  payment: Payment;
  category: Category;
  onPress: () => void;
}

export const PaymentCard: React.FC<PaymentCardProps> = ({payment, category, onPress}) => {
  const getStatusColor = () => {
    switch (payment.status) {
      case 'paid':
        return colors.success;
      case 'overdue':
        return colors.danger;
      default:
        return colors.warning;
    }
  };

  const getStatusText = () => {
    switch (payment.status) {
      case 'paid':
        return 'Paid';
      case 'overdue':
        return 'Overdue';
      default:
        return 'Pending';
    }
  };

  const getStatusIcon = () => {
    switch (payment.status) {
      case 'paid':
        return 'check-circle';
      case 'overdue':
        return 'alert-circle';
      default:
        return 'clock-outline';
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>{payment.title}</Text>
          {payment.isRecurring && (
            <Icon name="refresh" size={16} color={colors.primary} style={styles.recurringIcon} />
          )}
        </View>
        <View style={[styles.statusBadge, {backgroundColor: getStatusColor()}]}>
          <Icon name={getStatusIcon()} size={14} color={colors.surface} />
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>
      </View>
      
      <View style={styles.categorySection}>
        <View style={[styles.categoryDot, {backgroundColor: category.color}]} />
        <Text style={styles.categoryName}>{category.name}</Text>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.amount}>{formatCurrency(payment.amount)}</Text>
        <Text style={styles.date}>
          Due: {format(new Date(payment.dueDate), 'MMM dd, yyyy')}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.medium,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  titleSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    ...typography.h3,
    fontSize: 18,
    flex: 1,
    marginRight: spacing.xs,
  },
  recurringIcon: {
    marginLeft: spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    ...typography.caption,
    color: colors.surface,
    fontWeight: '600',
  },
  categorySection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.xs,
  },
  categoryName: {
    ...typography.body,
    fontSize: 14,
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amount: {
    ...typography.h2,
    fontSize: 24,
    color: colors.primary,
  },
  date: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
