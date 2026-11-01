import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Linking } from 'react-native';
import { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { useThemeColors } from '@/hooks/useThemeColors';
import { usePomodoroStore } from '@/store/usePomodoroStore';
import { ThemeMode } from '@/types/models';
import {
  requestNotificationPermissions,
  sendTestNotification,
} from '@/lib/notifications';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const { colors, themeMode } = useThemeColors();
  const { settings, updateSetting, initialize } = usePomodoroStore();
  const router = useRouter();

  useEffect(() => {
    initialize();
  }, []);

  const handleTestNotification = async () => {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      Alert.alert(t('common.confirm'), t('settings.notifications.permission_required'));
      return;
    }

    await sendTestNotification();
    Alert.alert(t('common.confirm'), t('settings.notifications.test_success'));
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const changeTheme = (mode: ThemeMode) => {
    updateSetting('theme_mode', mode);
  };

  const adjustDuration = (key: 'work_duration' | 'short_break_duration' | 'long_break_duration', delta: number) => {
    if (!settings) return;
    const currentValue = settings[key];
    const newValue = Math.max(1, Math.min(120, currentValue + delta));
    updateSetting(key, newValue);
  };

  const adjustDailyGoal = (delta: number) => {
    if (!settings) return;
    const newValue = Math.max(1, Math.min(20, settings.daily_goal + delta));
    updateSetting('daily_goal', newValue);
  };

  if (!settings) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          {t('common.loading')}
        </Text>
      </View>
    );
  }

  const appVersion = Constants.expoConfig?.version || '1.0.0';

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* 外观设置 */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('settings.theme.title')}
        </Text>

        <View style={[styles.settingItem, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="contrast" size={24} color={colors.primary} />
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                {t('settings.theme.label')}
              </Text>
              <Text style={[styles.settingHint, { color: colors.textSecondary }]}>
                {t('settings.theme.hint')}
              </Text>
            </View>
          </View>
          <View style={styles.themeButtons}>
            <TouchableOpacity
              style={[
                styles.themeButton,
                { borderColor: colors.border },
                themeMode === 'system' && { backgroundColor: colors.primary },
              ]}
              onPress={() => changeTheme('system')}
            >
              <Text style={[
                styles.themeButtonText,
                { color: themeMode === 'system' ? 'white' : colors.text },
              ]}>
                {t('settings.theme.system')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.themeButton,
                { borderColor: colors.border },
                themeMode === 'light' && { backgroundColor: colors.primary },
              ]}
              onPress={() => changeTheme('light')}
            >
              <Ionicons
                name="sunny"
                size={14}
                color={themeMode === 'light' ? 'white' : colors.text}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.themeButton,
                { borderColor: colors.border },
                themeMode === 'dark' && { backgroundColor: colors.primary },
              ]}
              onPress={() => changeTheme('dark')}
            >
              <Ionicons
                name="moon"
                size={14}
                color={themeMode === 'dark' ? 'white' : colors.text}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 语言设置 */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('settings.language.title')}
        </Text>

        <View style={[styles.settingItem, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="language" size={24} color={colors.primary} />
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                {t('settings.language.label')}
              </Text>
              <Text style={[styles.settingHint, { color: colors.textSecondary }]}>
                {i18n.language === 'zh' ? '中文' : 'English'}
              </Text>
            </View>
          </View>
          <View style={styles.languageButtons}>
            <TouchableOpacity
              style={[
                styles.languageButton,
                { borderColor: colors.border },
                i18n.language === 'en' && { backgroundColor: colors.primary },
              ]}
              onPress={() => changeLanguage('en')}
            >
              <Text style={[
                styles.languageButtonText,
                { color: i18n.language === 'en' ? 'white' : colors.text },
              ]}>
                EN
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.languageButton,
                { borderColor: colors.border },
                i18n.language === 'zh' && { backgroundColor: colors.primary },
              ]}
              onPress={() => changeLanguage('zh')}
            >
              <Text style={[
                styles.languageButtonText,
                { color: i18n.language === 'zh' ? 'white' : colors.text },
              ]}>
                中文
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 时长设置 */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('settings.duration.title')}
        </Text>

        {/* 工作时长 */}
        <View style={[styles.settingItem, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="timer" size={24} color={colors.working} />
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                {t('settings.duration.work.label')}
              </Text>
              <Text style={[styles.settingHint, { color: colors.textSecondary }]}>
                {t('settings.duration.work.hint')}
              </Text>
            </View>
          </View>
          <View style={styles.counterContainer}>
            <TouchableOpacity
              style={[styles.counterButton, { borderColor: colors.border }]}
              onPress={() => adjustDuration('work_duration', -5)}
            >
              <Ionicons name="remove" size={20} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.counterValue, { color: colors.text }]}>
              {t('common.minutes', { count: settings.work_duration })}
            </Text>
            <TouchableOpacity
              style={[styles.counterButton, { borderColor: colors.border }]}
              onPress={() => adjustDuration('work_duration', 5)}
            >
              <Ionicons name="add" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* 短休息时长 */}
        <View style={[styles.settingItem, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="cafe" size={24} color={colors.shortBreak} />
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                {t('settings.duration.short_break.label')}
              </Text>
              <Text style={[styles.settingHint, { color: colors.textSecondary }]}>
                {t('settings.duration.short_break.hint')}
              </Text>
            </View>
          </View>
          <View style={styles.counterContainer}>
            <TouchableOpacity
              style={[styles.counterButton, { borderColor: colors.border }]}
              onPress={() => adjustDuration('short_break_duration', -1)}
            >
              <Ionicons name="remove" size={20} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.counterValue, { color: colors.text }]}>
              {t('common.minutes', { count: settings.short_break_duration })}
            </Text>
            <TouchableOpacity
              style={[styles.counterButton, { borderColor: colors.border }]}
              onPress={() => adjustDuration('short_break_duration', 1)}
            >
              <Ionicons name="add" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* 长休息时长 */}
        <View style={[styles.settingItem, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="bed" size={24} color={colors.longBreak} />
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                {t('settings.duration.long_break.label')}
              </Text>
              <Text style={[styles.settingHint, { color: colors.textSecondary }]}>
                {t('settings.duration.long_break.hint')}
              </Text>
            </View>
          </View>
          <View style={styles.counterContainer}>
            <TouchableOpacity
              style={[styles.counterButton, { borderColor: colors.border }]}
              onPress={() => adjustDuration('long_break_duration', -5)}
            >
              <Ionicons name="remove" size={20} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.counterValue, { color: colors.text }]}>
              {t('common.minutes', { count: settings.long_break_duration })}
            </Text>
            <TouchableOpacity
              style={[styles.counterButton, { borderColor: colors.border }]}
              onPress={() => adjustDuration('long_break_duration', 5)}
            >
              <Ionicons name="add" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 目标设置 */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('settings.goal.title')}
        </Text>

        <View style={[styles.settingItem, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="flag" size={24} color={colors.primary} />
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                {t('settings.goal.daily_goal.label')}
              </Text>
              <Text style={[styles.settingHint, { color: colors.textSecondary }]}>
                {t('settings.goal.daily_goal.hint')}
              </Text>
            </View>
          </View>
          <View style={styles.counterContainer}>
            <TouchableOpacity
              style={[styles.counterButton, { borderColor: colors.border }]}
              onPress={() => adjustDailyGoal(-1)}
            >
              <Ionicons name="remove" size={20} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.counterValue, { color: colors.text }]}>
              {t('common.count_unit', { count: settings.daily_goal })}
            </Text>
            <TouchableOpacity
              style={[styles.counterButton, { borderColor: colors.border }]}
              onPress={() => adjustDailyGoal(1)}
            >
              <Ionicons name="add" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 通知设置 */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('settings.notifications.title')}
        </Text>

        <View style={[styles.settingItem, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="notifications" size={24} color={colors.primary} />
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                {t('settings.notifications.enable.label')}
              </Text>
              <Text style={[styles.settingHint, { color: colors.textSecondary }]}>
                {t('settings.notifications.enable.hint')}
              </Text>
            </View>
          </View>
          <Switch
            value={settings.notification_enabled}
            onValueChange={(value) => updateSetting('notification_enabled', value)}
            trackColor={{ false: colors.switchTrackOff, true: colors.switchTrackOn }}
            thumbColor={colors.switchThumb}
          />
        </View>

        <View style={[styles.settingItem, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="volume-high" size={24} color={colors.warning} />
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                {t('settings.notifications.sound.label')}
              </Text>
              <Text style={[styles.settingHint, { color: colors.textSecondary }]}>
                {t('settings.notifications.sound.hint')}
              </Text>
            </View>
          </View>
          <Switch
            value={settings.sound_enabled}
            onValueChange={(value) => updateSetting('sound_enabled', value)}
            trackColor={{ false: colors.switchTrackOff, true: colors.switchTrackOn }}
            thumbColor={colors.switchThumb}
          />
        </View>

        <TouchableOpacity
          style={[styles.testButton, { backgroundColor: colors.buttonBackground, borderColor: colors.buttonBorder }]}
          onPress={handleTestNotification}
        >
          <Ionicons name="mail" size={20} color={colors.buttonText} />
          <Text style={[styles.testButtonText, { color: colors.buttonText }]}>
            {t('settings.notifications.test_button')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 自动控制 */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('settings.auto_control.title')}
        </Text>

        <View style={[styles.settingItem, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="play-circle" size={24} color={colors.success} />
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                {t('settings.auto_control.auto_start_break.label')}
              </Text>
              <Text style={[styles.settingHint, { color: colors.textSecondary }]}>
                {t('settings.auto_control.auto_start_break.hint')}
              </Text>
            </View>
          </View>
          <Switch
            value={settings.auto_start_break}
            onValueChange={(value) => updateSetting('auto_start_break', value)}
            trackColor={{ false: colors.switchTrackOff, true: colors.switchTrackOn }}
            thumbColor={colors.switchThumb}
          />
        </View>

        <View style={[styles.settingItem, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="timer" size={24} color={colors.working} />
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                {t('settings.auto_control.auto_start_work.label')}
              </Text>
              <Text style={[styles.settingHint, { color: colors.textSecondary }]}>
                {t('settings.auto_control.auto_start_work.hint')}
              </Text>
            </View>
          </View>
          <Switch
            value={settings.auto_start_work}
            onValueChange={(value) => updateSetting('auto_start_work', value)}
            trackColor={{ false: colors.switchTrackOff, true: colors.switchTrackOn }}
            thumbColor={colors.switchThumb}
          />
        </View>
      </View>

      {/* 关于 */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('settings.about.title')}
        </Text>

        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: colors.cardBackground }]}
          onPress={() => router.push('/privacy' as never)}
        >
          <View style={styles.settingLeft}>
            <Ionicons name="shield-checkmark" size={24} color={colors.success} />
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                {t('settings.about.privacy_policy.label')}
              </Text>
              <Text style={[styles.settingHint, { color: colors.textSecondary }]}>
                {t('settings.about.privacy_policy.hint')}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: colors.cardBackground }]}
          onPress={() => Linking.openURL('https://github.com/XavierZhao1989/pomodoro-timer/issues')}
        >
          <View style={styles.settingLeft}>
            <Ionicons name="chatbubble-ellipses" size={24} color={colors.warning} />
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                {t('settings.about.feedback.label')}
              </Text>
              <Text style={[styles.settingHint, { color: colors.textSecondary }]}>
                {t('settings.about.feedback.hint')}
              </Text>
            </View>
          </View>
          <Ionicons name="open-outline" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        <View style={[styles.settingItem, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="information-circle" size={24} color={colors.primary} />
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                {t('settings.about.version.label')}
              </Text>
              <Text style={[styles.settingHint, { color: colors.textSecondary }]}>
                {t('settings.about.version.hint')}
              </Text>
            </View>
          </View>
          <Text style={[styles.versionText, { color: colors.textSecondary }]}>
            v{appVersion}
          </Text>
        </View>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 12,
    marginTop: 8,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingInfo: {
    marginLeft: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingHint: {
    fontSize: 13,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  counterButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterValue: {
    fontSize: 15,
    fontWeight: '600',
    minWidth: 80,
    textAlign: 'center',
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 2,
    gap: 8,
  },
  testButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  languageButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  languageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 60,
    alignItems: 'center',
  },
  languageButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  themeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  themeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  versionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  bottomPadding: {
    height: 40,
  },
});
