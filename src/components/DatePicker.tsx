import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors, spacing, typography, shadows} from '../utils/theme';
import {format, addDays, addMonths, startOfMonth, getDaysInMonth} from 'date-fns';

interface DatePickerProps {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  minimumDate?: Date;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  minimumDate,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value);

  const today = new Date();
  const quickDates = [
    {label: 'Today', days: 0, date: today},
    {label: 'Tomorrow', days: 1, date: addDays(today, 1)},
    {label: 'Next Week', days: 7, date: addDays(today, 7)},
    {label: 'Next Month', days: 30, date: addDays(today, 30)},
  ];

  const handleQuickDate = (date: Date) => {
    setSelectedDate(date);
    onChange(date);
    setShowPicker(false);
  };

  const handleConfirm = () => {
    onChange(selectedDate);
    setShowPicker(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowPicker(true)}
        activeOpacity={0.7}>
        <Icon name="calendar" size={20} color={colors.primary} />
        <Text style={styles.inputText}>
          {format(value, 'MMMM dd, yyyy')}
        </Text>
        <Icon name="chevron-down" size={20} color={colors.textSecondary} />
      </TouchableOpacity>

      <Modal
        visible={showPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPicker(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Due Date</Text>
              <TouchableOpacity onPress={() => setShowPicker(false)}>
                <Icon name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.quickDatesContainer}>
              <Text style={styles.sectionLabel}>Quick Select</Text>
              <View style={styles.quickDatesGrid}>
                {quickDates.map(({label, date}) => (
                  <TouchableOpacity
                    key={label}
                    style={styles.quickDateButton}
                    onPress={() => handleQuickDate(date)}
                    activeOpacity={0.7}>
                    <Text style={styles.quickDateText}>{label}</Text>
                    <Text style={styles.quickDateSubtext}>
                      {format(date, 'MMM dd')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.selectedDateContainer}>
              <Text style={styles.sectionLabel}>Selected Date</Text>
              <Text style={styles.selectedDate}>
                {format(selectedDate, 'EEEE, MMMM dd, yyyy')}
              </Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowPicker(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleConfirm}>
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    gap: spacing.sm,
  },
  inputText: {
    ...typography.body,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.lg,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    ...typography.h2,
    fontSize: 24,
  },
  quickDatesContainer: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  quickDatesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  quickDateButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    ...shadows.small,
  },
  quickDateText: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  quickDateSubtext: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  selectedDateContainer: {
    marginBottom: spacing.lg,
  },
  selectedDate: {
    ...typography.h3,
    color: colors.primary,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  modalButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.background,
  },
  confirmButton: {
    backgroundColor: colors.primary,
  },
  cancelButtonText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
  },
  confirmButtonText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.surface,
  },
});
