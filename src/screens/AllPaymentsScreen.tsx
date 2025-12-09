import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors, spacing, typography, shadows} from '../utils/theme';
import {Payment, Category} from '../types';
import {loadPayments, loadCategories} from '../services/storage';
import {PaymentCard} from '../components/PaymentCard';
import {
  updatePaymentStatus,
  sortPaymentsByDate,
  getCategoryById,
  filterPaymentsByStatus,
} from '../utils/helpers';
import {useFocusEffect} from '@react-navigation/native';

export const AllPaymentsScreen = ({navigation}: any) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'paid' | 'overdue'>('all');

  const loadData = async () => {
    try {
      const loadedPayments = await loadPayments();
      const loadedCategories = await loadCategories();
      
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

  useEffect(() => {
    applyFilters();
  }, [payments, searchQuery, filterStatus]);

  const applyFilters = () => {
    let filtered = [...payments];

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filterPaymentsByStatus(filtered, filterStatus);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(payment => {
        const titleMatch = payment.title.toLowerCase().includes(query);
        const category = getCategoryById(categories, payment.categoryId);
        const categoryMatch = category?.name.toLowerCase().includes(query);
        const notesMatch = payment.notes?.toLowerCase().includes(query);
        
        return titleMatch || categoryMatch || notesMatch;
      });
    }

    setFilteredPayments(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const renderFilterButton = (
    label: string,
    status: typeof filterStatus,
    icon: string,
    color: string
  ) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filterStatus === status && styles.filterButtonActive,
        filterStatus === status && {borderColor: color},
      ]}
      onPress={() => setFilterStatus(status)}
      activeOpacity={0.7}>
      <Icon
        name={icon}
        size={18}
        color={filterStatus === status ? color : colors.textSecondary}
      />
      <Text
        style={[
          styles.filterButtonText,
          filterStatus === status && {color},
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
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
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="magnify" size={24} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search payments..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Buttons */}
      <View style={styles.filtersContainer}>
        {renderFilterButton('All', 'all', 'format-list-bulleted', colors.primary)}
        {renderFilterButton('Pending', 'pending', 'clock-outline', colors.warning)}
        {renderFilterButton('Overdue', 'overdue', 'alert-circle', colors.danger)}
        {renderFilterButton('Paid', 'paid', 'check-circle', colors.success)}
      </View>

      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>
          {filteredPayments.length} {filteredPayments.length === 1 ? 'payment' : 'payments'}
        </Text>
      </View>

      {/* Payments List */}
      <FlatList
        data={filteredPayments}
        renderItem={renderPaymentItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon
              name={searchQuery ? 'file-search-outline' : 'receipt-text-outline'}
              size={64}
              color={colors.disabled}
            />
            <Text style={styles.emptyText}>
              {searchQuery ? 'No payments found' : 'No payments yet'}
            </Text>
            <Text style={styles.emptySubtext}>
              {searchQuery
                ? 'Try adjusting your search or filters'
                : 'Tap the + button to add your first payment'}
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    margin: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    ...shadows.small,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    ...typography.body,
    color: colors.text,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: 'transparent',
    gap: 4,
  },
  filterButtonActive: {
    borderWidth: 2,
  },
  filterButtonText: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  resultsHeader: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  resultsText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
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
});
