import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import {colors, spacing, typography, shadows} from '../utils/theme';
import {Button} from '../components/Button';
import {loadSettings, saveSettings, clearAllData} from '../services/storage';
import {AppSettings} from '../types';

export const SettingsScreen = () => {
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
          <Button
            title="Save Settings"
            onPress={handleSaveSettings}
            style={{marginBottom: spacing.md}}
          />
          
          <Button
            title="Clear All Data"
            onPress={handleClearData}
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
