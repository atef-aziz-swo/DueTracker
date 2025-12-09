import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
  Platform,
} from 'react-native';
import {colors, spacing, typography, shadows} from '../utils/theme';
import {Button} from '../components/Button';
import {loadSettings, saveSettings, clearAllData} from '../services/storage';
import {exportData, downloadJSON, importData} from '../utils/exportImport';
import {AppSettings} from '../types';

export const SettingsScreen = ({navigation}: any) => {
  const [settings, setSettings] = useState<AppSettings | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const loadedSettings = await loadSettings();
    setSettings(loadedSettings);
  };

  const handleSaveSettings = async () => {
    if (!settings) return;
    
    try {
      await saveSettings(settings);
      Alert.alert('Success', 'Settings saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to delete all data? This action cannot be undone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllData();
              Alert.alert('Success', 'All data cleared successfully');
              setSettings(null);
              loadData();
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data');
            }
          },
        },
      ]
    );
  };

  const handleExportData = async () => {
    try {
      const jsonData = await exportData();
      
      if (Platform.OS === 'web') {
        downloadJSON(jsonData);
        Alert.alert('Success', 'Data exported successfully');
      } else {
        // For mobile, you could use Share API or file system
        Alert.alert('Export Data', jsonData, [
          {text: 'OK'},
        ]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to export data');
    }
  };

  const handleImportData = () => {
    if (Platform.OS === 'web') {
      // Create file input for web
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = async (e: any) => {
        const file = e.target?.files?.[0];
        if (file) {
          try {
            const reader = new FileReader();
            reader.onload = async (event) => {
              try {
                const jsonString = event.target?.result as string;
                await importData(jsonString);
                Alert.alert('Success', 'Data imported successfully. Please refresh the app.');
                loadData();
              } catch (error) {
                Alert.alert('Error', 'Failed to import data. Please check the file format.');
              }
            };
            reader.readAsText(file);
          } catch (error) {
            Alert.alert('Error', 'Failed to read file');
          }
        }
      };
      input.click();
    } else {
      Alert.alert('Import Data', 'Please paste your backup JSON data', [
        {text: 'Cancel', style: 'cancel'},
      ]);
    }
  };

  if (!settings) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Enable Notifications</Text>
            <Switch
              value={settings.notifications.enabled}
              onValueChange={(value) =>
                setSettings({
                  ...settings,
                  notifications: {...settings.notifications, enabled: value},
                })
              }
              trackColor={{false: colors.disabled, true: colors.primary}}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Notification Sound</Text>
            <Switch
              value={settings.notifications.soundEnabled}
              onValueChange={(value) =>
                setSettings({
                  ...settings,
                  notifications: {...settings.notifications, soundEnabled: value},
                })
              }
              trackColor={{false: colors.disabled, true: colors.primary}}
              disabled={!settings.notifications.enabled}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.settingLabel}>Default Reminder Days</Text>
            <Text style={styles.settingSubtext}>
              Days before due date to send reminder
            </Text>
            <View style={styles.numberButtons}>
              {[1, 2, 3, 5, 7].map(days => (
                <Button
                  key={days}
                  title={`${days}d`}
                  onPress={() =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        defaultDaysBefore: days,
                      },
                    })
                  }
                  variant={
                    settings.notifications.defaultDaysBefore === days
                      ? 'primary'
                      : 'secondary'
                  }
                  style={styles.dayButton}
                />
              ))}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Storage</Text>
            <Text style={styles.infoValue}>Local (AsyncStorage)</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          
          <Button
            title="Manage Categories"
            onPress={() => navigation.navigate('Categories')}
            icon="folder-edit"
            variant="secondary"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <Button
            title="Export Data"
            onPress={handleExportData}
            icon="download"
            variant="secondary"
            style={{marginBottom: spacing.md}}
          />
          
          <Button
            title="Import Data"
            onPress={handleImportData}
            icon="upload"
            variant="secondary"
            style={{marginBottom: spacing.md}}
          />
        </View>

        <View style={styles.section}>
          <Button
            title="Save Settings"
            onPress={handleSaveSettings}
            icon="content-save"
            style={{marginBottom: spacing.md}}
          />
          
          <Button
            title="Clear All Data"
            onPress={handleClearData}
            icon="delete-forever"
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
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h2,
    fontSize: 22,
    marginBottom: spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
    ...shadows.small,
  },
  settingLabel: {
    ...typography.body,
    fontWeight: '600',
  },
  settingSubtext: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  inputGroup: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 12,
    marginTop: spacing.sm,
    ...shadows.small,
  },
  numberButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  dayButton: {
    flex: 0,
    paddingHorizontal: spacing.lg,
    minHeight: 40,
  },
  infoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
    ...shadows.small,
  },
  infoLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  infoValue: {
    ...typography.body,
    fontWeight: '600',
  },
});
