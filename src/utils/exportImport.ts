import {Payment, Category, AppSettings} from '../types';
import {loadPayments, loadCategories, loadSettings, savePayments, saveCategories} from '../services/storage';

export interface ExportData {
  version: string;
  exportDate: string;
  payments: Payment[];
  categories: Category[];
  settings: AppSettings;
}

/**
 * Export all app data to JSON format
 */
export const exportData = async (): Promise<string> => {
  try {
    const payments = await loadPayments();
    const categories = await loadCategories();
    const settings = await loadSettings();

    const exportData: ExportData = {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      payments,
      categories,
      settings,
    };

    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error('Error exporting data:', error);
    throw new Error('Failed to export data');
  }
};

/**
 * Import data from JSON string
 */
export const importData = async (jsonString: string): Promise<void> => {
  try {
    const data: ExportData = JSON.parse(jsonString);

    // Validate data structure
    if (!data.version || !data.payments || !data.categories) {
      throw new Error('Invalid data format');
    }

    // Validate that payments and categories are arrays
    if (!Array.isArray(data.payments) || !Array.isArray(data.categories)) {
      throw new Error('Invalid data format: payments and categories must be arrays');
    }

    // Convert date strings back to Date objects
    const payments: Payment[] = data.payments.map(p => ({
      ...p,
      dueDate: new Date(p.dueDate),
      createdAt: new Date(p.createdAt),
      updatedAt: new Date(p.updatedAt),
    }));

    // Save imported data
    await savePayments(payments);
    await saveCategories(data.categories);

    console.log('Data imported successfully');
  } catch (error) {
    console.error('Error importing data:', error);
    throw new Error('Failed to import data. Please check the file format.');
  }
};

/**
 * Download data as JSON file (web platform)
 */
export const downloadJSON = (jsonString: string, filename: string = 'duetracker-backup.json') => {
  if (typeof window === 'undefined') return;

  const blob = new Blob([jsonString], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Read JSON file from input (web platform)
 */
export const readJSONFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
};
