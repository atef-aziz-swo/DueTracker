import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors, spacing, typography, shadows} from '../utils/theme';
import {InputField} from '../components/InputField';
import {DatePicker} from '../components/DatePicker';
import {Button} from '../components/Button';
import {Category, Payment} from '../types';
import {loadCategories, loadPayments, savePayments} from '../services/storage';
import {formatCurrency} from '../utils/helpers';
import {format} from 'date-fns';

export const PaymentDetailScreen = ({route, navigation}: any) => {
  const {paymentId} = route.params;
  const [payment, setPayment] = useState<Payment | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  
  // Edit form state
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [notes, setNotes] = useState('');
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [notificationDays, setNotificationDays] = useState('3');
  const [isRecurring, setIsRecurring] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const payments = await loadPayments();
    const cats = await loadCategories();
    const currentPayment = payments.find(p => p.id === paymentId);
    
    if (currentPayment) {
      setPayment(currentPayment);
      setTitle(currentPayment.title);
      setAmount(currentPayment.amount.toString());
      setDueDate(new Date(currentPayment.dueDate));
      setSelectedCategoryId(currentPayment.categoryId);
      setNotes(currentPayment.notes || '');
      setNotificationEnabled(currentPayment.notificationEnabled);
      setNotificationDays((currentPayment.notificationDays || 3).toString());
      setIsRecurring(currentPayment.isRecurring);
    }
    
    setCategories(cats);
  };

  const handleMarkAsPaid = async () => {
    if (!payment) return;

    Alert.alert(
      'Mark as Paid',
      'Are you sure you want to mark this payment as paid?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Mark as Paid',
          onPress: async () => {
            try {
              const payments = await loadPayments();
              const updatedPayments = payments.map(p =>
                p.id === payment.id ? {...p, status: 'paid' as const} : p
              );
              await savePayments(updatedPayments);
              Alert.alert('Success', 'Payment marked as paid', [
                {text: 'OK', onPress: () => navigation.goBack()},
              ]);
            } catch (error) {
              Alert.alert('Error', 'Failed to update payment');
            }
          },
        },
      ]
    );
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete Payment',
      'Are you sure you want to delete this payment?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const payments = await loadPayments();
              const updatedPayments = payments.filter(p => p.id !== paymentId);
              await savePayments(updatedPayments);
              Alert.alert('Success', 'Payment deleted', [
                {text: 'OK', onPress: () => navigation.goBack()},
              ]);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete payment');
            }
          },
        },
      ]
    );
  };

  const handleSave = async () => {
    if (!payment) return;

    try {
      const payments = await loadPayments();
      const updatedPayment: Payment = {
        ...payment,
        title: title.trim(),
        amount: parseFloat(amount),
        dueDate: dueDate,
        categoryId: selectedCategoryId,
        notes: notes.trim() || undefined,
        notificationEnabled,
        notificationDays: notificationEnabled ? parseInt(notificationDays) : undefined,
        isRecurring,
        updatedAt: new Date(),
      };

      const updatedPayments = payments.map(p =>
        p.id === payment.id ? updatedPayment : p
      );
      
      await savePayments(updatedPayments);
      setPayment(updatedPayment);
      setIsEditing(false);
      Alert.alert('Success', 'Payment updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update payment');
    }
  };

  if (!payment) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Payment not found</Text>
      </View>
    );
  }

  const category = categories.find(c => c.id === payment.categoryId);

  if (isEditing) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <InputField
            label="Title"
            value={title}
            onChangeText={setTitle}
            placeholder="Payment description"
          />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category</Text>
            <View style={styles.categoryList}>
              {categories.map(cat => (
                <Button
                  key={cat.id}
                  title={cat.name}
                  onPress={() => setSelectedCategoryId(cat.id)}
                  variant={selectedCategoryId === cat.id ? 'primary' : 'secondary'}
                  style={{marginBottom: spacing.sm}}
                />
              ))}
            </View>
          </View>

          <InputField
            label="Amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            placeholder="0.00"
          />

          <DatePicker
            label="Due Date"
            value={dueDate}
            onChange={setDueDate}
          />

          <InputField
            label="Notes (Optional)"
            value={notes}
            onChangeText={setNotes}
            placeholder="Additional information..."
            multiline
            numberOfLines={3}
          />

          <View style={styles.switchSection}>
            <View style={styles.switchRow}>
              <Text style={styles.label}>Recurring Payment</Text>
              <Switch
                value={isRecurring}
                onValueChange={setIsRecurring}
                trackColor={{false: colors.disabled, true: colors.primary}}
              />
            </View>
          </View>

          <View style={styles.switchSection}>
            <View style={styles.switchRow}>
              <Text style={styles.label}>Enable Reminder</Text>
              <Switch
                value={notificationEnabled}
                onValueChange={setNotificationEnabled}
                trackColor={{false: colors.disabled, true: colors.primary}}
              />
            </View>
            {notificationEnabled && (
              <InputField
                label="Remind (days before due date)"
                value={notificationDays}
                onChangeText={setNotificationDays}
                keyboardType="number-pad"
                placeholder="3"
              />
            )}
          </View>

          <View style={styles.buttonRow}>
            <Button
              title="Cancel"
              onPress={() => {
                setIsEditing(false);
                loadData();
              }}
              variant="secondary"
              style={{flex: 1, marginRight: spacing.sm}}
            />
            <Button
              title="Save"
              onPress={handleSave}
              style={{flex: 1}}
            />
          </View>
        </View>
      </ScrollView>
    );
  }

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
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.statusBadge}>
            <Icon name={getStatusIcon()} size={24} color={getStatusColor()} />
            <Text style={[styles.statusText, {color: getStatusColor()}]}>
              {payment.status.toUpperCase()}
            </Text>
          </View>
          
          <Text style={styles.paymentTitle}>{payment.title}</Text>
          <Text style={styles.amount}>{formatCurrency(payment.amount)}</Text>
          
          {category && (
            <View style={styles.categorySection}>
              <View style={[styles.categoryDot, {backgroundColor: category.color}]} />
              <Text style={styles.categoryName}>{category.name}</Text>
            </View>
          )}
        </View>

        {/* Details Card */}
        <View style={styles.detailCard}>
          <View style={styles.detailRow}>
            <Icon name="calendar" size={20} color={colors.textSecondary} />
            <Text style={styles.detailLabel}>Due Date</Text>
            <Text style={styles.detailValue}>
              {format(new Date(payment.dueDate), 'MMMM dd, yyyy')}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Icon name="calendar-clock" size={20} color={colors.textSecondary} />
            <Text style={styles.detailLabel}>Created</Text>
            <Text style={styles.detailValue}>
              {format(new Date(payment.createdAt), 'MMM dd, yyyy')}
            </Text>
          </View>

          {payment.isRecurring && (
            <View style={styles.detailRow}>
              <Icon name="refresh" size={20} color={colors.primary} />
              <Text style={styles.detailLabel}>Recurring</Text>
              <Text style={styles.detailValue}>Yes</Text>
            </View>
          )}

          {payment.notificationEnabled && (
            <View style={styles.detailRow}>
              <Icon name="bell" size={20} color={colors.primary} />
              <Text style={styles.detailLabel}>Reminder</Text>
              <Text style={styles.detailValue}>
                {payment.notificationDays} days before
              </Text>
            </View>
          )}

          {payment.notes && (
            <View style={[styles.detailRow, styles.notesRow]}>
              <Icon name="note-text" size={20} color={colors.textSecondary} />
              <Text style={styles.detailLabel}>Notes</Text>
              <Text style={styles.notesValue}>{payment.notes}</Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          {payment.status !== 'paid' && (
            <Button
              title="Mark as Paid"
              onPress={handleMarkAsPaid}
              icon="check-circle"
              variant="primary"
              style={{marginBottom: spacing.md}}
            />
          )}
          
          <Button
            title="Edit Payment"
            onPress={() => setIsEditing(true)}
            icon="pencil"
            variant="secondary"
            style={{marginBottom: spacing.md}}
          />
          
          <Button
            title="Delete Payment"
            onPress={handleDelete}
            icon="delete"
            variant="danger"
          />
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
  errorText: {
    ...typography.body,
    color: colors.danger,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  headerCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    alignItems: 'center',
    ...shadows.medium,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  statusText: {
    ...typography.caption,
    fontWeight: '700',
    fontSize: 14,
  },
  paymentTitle: {
    ...typography.h1,
    fontSize: 26,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  amount: {
    ...typography.h1,
    fontSize: 36,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  categorySection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.xs,
  },
  categoryName: {
    ...typography.body,
    color: colors.textSecondary,
  },
  detailCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  notesRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderBottomWidth: 0,
  },
  detailLabel: {
    ...typography.body,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  detailValue: {
    ...typography.body,
    fontWeight: '600',
  },
  notesValue: {
    ...typography.body,
    marginTop: spacing.xs,
    marginLeft: spacing.lg + spacing.xs,
  },
  actions: {
    marginTop: spacing.md,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  categoryList: {
    marginBottom: spacing.md,
  },
  switchSection: {
    marginBottom: spacing.lg,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  label: {
    ...typography.body,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: spacing.md,
  },
});
