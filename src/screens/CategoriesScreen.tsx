import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors, spacing, typography, shadows} from '../utils/theme';
import {InputField} from '../components/InputField';
import {Button} from '../components/Button';
import {Category} from '../types';
import {loadCategories, saveCategories} from '../services/storage';
import {generateId} from '../utils/helpers';

export const CategoriesScreen = ({navigation}: any) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#4ade80');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const cats = await loadCategories();
    setCategories(cats);
  };

  const predefinedColors = [
    '#4ade80', '#60a5fa', '#f472b6', '#fbbf24', '#a78bfa',
    '#34d399', '#38bdf8', '#fb7185', '#facc15', '#c084fc',
    '#10b981', '#0ea5e9', '#ec4899', '#f59e0b', '#8b5cf6',
  ];

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }

    try {
      const newCategory: Category = {
        id: generateId(),
        name: newCategoryName.trim(),
        parentId: null,
        color: selectedColor,
      };

      const updatedCategories = [...categories, newCategory];
      await saveCategories(updatedCategories);
      setCategories(updatedCategories);
      setNewCategoryName('');
      setIsAdding(false);
      Alert.alert('Success', 'Category added successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to add category');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    Alert.alert(
      'Delete Category',
      'Are you sure you want to delete this category? Payments using this category will need to be reassigned.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedCategories = categories.filter(c => c.id !== categoryId);
              await saveCategories(updatedCategories);
              setCategories(updatedCategories);
              Alert.alert('Success', 'Category deleted');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete category');
            }
          },
        },
      ]
    );
  };

  const renderCategoryItem = (category: Category) => (
    <View key={category.id} style={styles.categoryItem}>
      <View style={[styles.colorDot, {backgroundColor: category.color}]} />
      <Text style={styles.categoryName}>{category.name}</Text>
      <TouchableOpacity
        onPress={() => handleDeleteCategory(category.id)}
        style={styles.deleteButton}>
        <Icon name="delete" size={24} color={colors.danger} />
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Manage Categories</Text>
          <Text style={styles.headerSubtitle}>
            Organize your payments with custom categories
          </Text>
        </View>

        {isAdding ? (
          <View style={styles.addForm}>
            <InputField
              label="Category Name"
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              placeholder="e.g., Insurance, Entertainment"
            />

            <Text style={styles.colorLabel}>Choose Color</Text>
            <View style={styles.colorGrid}>
              {predefinedColors.map(color => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    {backgroundColor: color},
                    selectedColor === color && styles.colorOptionSelected,
                  ]}
                  onPress={() => setSelectedColor(color)}
                  activeOpacity={0.7}>
                  {selectedColor === color && (
                    <Icon name="check" size={20} color={colors.surface} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.buttonRow}>
              <Button
                title="Cancel"
                onPress={() => {
                  setIsAdding(false);
                  setNewCategoryName('');
                }}
                variant="secondary"
                style={{flex: 1, marginRight: spacing.sm}}
              />
              <Button
                title="Add Category"
                onPress={handleAddCategory}
                style={{flex: 1}}
              />
            </View>
          </View>
        ) : (
          <Button
            title="Add New Category"
            onPress={() => setIsAdding(true)}
            icon="plus"
            style={{marginBottom: spacing.lg}}
          />
        )}

        <View style={styles.categoriesList}>
          <Text style={styles.sectionTitle}>Your Categories</Text>
          {categories.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="folder-outline" size={64} color={colors.disabled} />
              <Text style={styles.emptyText}>No categories yet</Text>
            </View>
          ) : (
            categories.map(renderCategoryItem)
          )}
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
  header: {
    marginBottom: spacing.lg,
  },
  headerTitle: {
    ...typography.h1,
    fontSize: 28,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  addForm: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.medium,
  },
  colorLabel: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorOptionSelected: {
    borderWidth: 3,
    borderColor: colors.primary,
  },
  buttonRow: {
    flexDirection: 'row',
  },
  categoriesList: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    ...typography.h2,
    fontSize: 22,
    marginBottom: spacing.md,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.small,
  },
  colorDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: spacing.md,
  },
  categoryName: {
    ...typography.body,
    fontWeight: '600',
    flex: 1,
  },
  deleteButton: {
    padding: spacing.xs,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
});
