import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import {colors, spacing, typography} from '../utils/theme';
import {InputField} from '../components/InputField';
import {DatePicker} from '../components/DatePicker';
import {Button} from '../components/Button';
import {Category, Payment} from '../types';
import {loadCategories, loadPayments, savePayments, loadSettings} from '../services/storage';
import {generateId} from '../utils/helpers';
import {schedulePaymentReminder} from '../services/notifications';

export const AddPaymentScreen = ({navigation}: any) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [notificationDays, setNotificationDays] = useState('3');
  const [isRecurring, setIsRecurring] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const cats = await loadCategories();
    const settings = await loadSettings();
    setCategories(cats);
    setNotificationDays(settings.notifications.defaultDaysBefore.toString());
    setNotificationEnabled(settings.notifications.enabled);
  };

  const validate = (): boolean => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return false;
    }
    if (!selectedCategoryId) {
      Alert.alert('Error', 'Please select a category');
      return false;
    }
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const existingPayments = await loadPayments();
      const category = categories.find(c => c.id === selectedCategoryId);
      
      if (!category) {
        Alert.alert('Error', 'Category not found');
        setLoading(false);
        return;
      }

      const newPayment: Payment = {
        id: generateId(),
        title: title.trim(),
        amount: parseFloat(amount),
        dueDate: dueDate,
        categoryId: selectedCategoryId,
        status: 'pending',
        isRecurring,
        isTemplate: false,
        notificationEnabled,
        notificationDays: notificationEnabled ? parseInt(notificationDays) : undefined,
        notes: notes.trim() || undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await savePayments([...existingPayments, newPayment]);

      // Schedule notification if enabled
      if (notificationEnabled) {
        schedulePaymentReminder(newPayment, category);
      }

      Alert.alert('Success', 'Payment added successfully', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (error) {
      console.error('Error creating payment:', error);
      Alert.alert('Error', 'Failed to create payment');
    } finally {
      setLoading(false);
    }
  };

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
          {categories.length === 0 ? (
            <Text style={styles.noCategoriesText}>
              No categories available
            </Text>
          ) : (
            <View style={styles.categoryList}>
              {categories.map(category => (
                <Button
                  key={category.id}
                  title={category.name}
                  onPress={() => setSelectedCategoryId(category.id)}
                  variant={
                    selectedCategoryId === category.id ? 'primary' : 'secondary'
                  }
                  style={{marginBottom: spacing.sm}}
                />
              ))}
            </View>
          )}
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

        <Button
          title="Add Payment"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
        />
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
    ...typography.h3,
    marginBottom: spacing.md,
  },
  categoryList: {
    marginBottom: spacing.md,
  },
  noCategoriesText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    padding: spacing.lg,
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
});
