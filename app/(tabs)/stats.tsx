import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '@/hooks/useThemeColors';
import { usePomodoroStore } from '@/store/usePomodoroStore';
import WeeklyFocusChart from '@/components/WeeklyFocusChart';

export default function StatsScreen() {
  const { t } = useTranslation();
  const { colors } = useThemeColors();
  const {
    initialize,
    todayStats,
    sessions,
    settings,
    deleteSession,
  } = usePomodoroStore();

  useEffect(() => {
    initialize();
  }, []);

  // 格式化时间
  const formatTime = (timestamp: number) => {
    return format(timestamp, 'HH:mm');
  };

  // 获取会话图标
  const getSessionIcon = (type: string) => {
    switch (type) {
      case 'work':
        return 'timer';
      case 'short_break':
        return 'cafe';
      case 'long_break':
        return 'bed';
      default:
        return 'ellipse';
    }
  };

  // 获取会话颜色
  const getSessionColor = (type: string) => {
    switch (type) {
      case 'work':
        return colors.working;
      case 'short_break':
        return colors.shortBreak;
      case 'long_break':
        return colors.longBreak;
      default:
        return colors.idle;
    }
  };

  // 获取会话标题
  const getSessionTitle = (type: string) => {
    return t(`stats.sessions.types.${type}`, type);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* 今日概览 */}
      <View style={[styles.overviewCard, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.overviewTitle, { color: colors.text }]}>
          {t('stats.overview.title')}
        </Text>

        <View style={styles.overviewGrid}>
          <View style={styles.overviewItem}>
            <View style={[styles.iconContainer, { backgroundColor: colors.working + '20' }]}>
              <Ionicons name="checkmark-circle" size={32} color={colors.working} />
            </View>
            <Text style={[styles.overviewValue, { color: colors.text }]}>
              {todayStats?.completed_count || 0}
            </Text>
            <Text style={[styles.overviewLabel, { color: colors.textSecondary }]}>
              {t('stats.overview.completed_pomodoros')}
            </Text>
          </View>

          <View style={styles.overviewItem}>
            <View style={[styles.iconContainer, { backgroundColor: colors.success + '20' }]}>
              <Ionicons name="time" size={32} color={colors.success} />
            </View>
            <Text style={[styles.overviewValue, { color: colors.text }]}>
              {todayStats?.total_focus_minutes || 0}
            </Text>
            <Text style={[styles.overviewLabel, { color: colors.textSecondary }]}>
              {t('stats.overview.focus_minutes')}
            </Text>
          </View>

          <View style={styles.overviewItem}>
            <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
              <Ionicons name="trending-up" size={32} color={colors.primary} />
            </View>
            <Text style={[styles.overviewValue, { color: colors.text }]}>
              {Math.round(todayStats?.completion_rate || 0)}%
            </Text>
            <Text style={[styles.overviewLabel, { color: colors.textSecondary }]}>
              {t('stats.overview.completion_rate')}
            </Text>
          </View>
        </View>
      </View>

      {/* 最近 7 天趋势 */}
      <WeeklyFocusChart refreshKey={sessions} />

      {/* 今日会话列表 */}
      <View style={styles.sessionsSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('stats.sessions.title')} {t('stats.sessions.count', { count: sessions.length })}
        </Text>

        {sessions.length === 0 ? (
          <View style={[styles.emptyContainer, { backgroundColor: colors.cardBackground }]}>
            <Ionicons name="calendar-outline" size={48} color={colors.textTertiary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {t('stats.sessions.empty')}
            </Text>
            <Text style={[styles.emptyHint, { color: colors.textTertiary }]}>
              {t('stats.sessions.empty_hint')}
            </Text>
          </View>
        ) : (
          sessions.map((session) => (
            <View
              key={session.id}
              style={[styles.sessionItem, { backgroundColor: colors.sessionItemBackground }]}
            >
              <View style={styles.sessionLeft}>
                <View
                  style={[
                    styles.sessionIcon,
                    { backgroundColor: getSessionColor(session.type) + '20' },
                  ]}
                >
                  <Ionicons
                    name={getSessionIcon(session.type)}
                    size={20}
                    color={getSessionColor(session.type)}
                  />
                </View>

                <View style={styles.sessionInfo}>
                  <Text style={[styles.sessionTitle, { color: colors.text }]}>
                    {getSessionTitle(session.type)}
                  </Text>
                  <Text style={[styles.sessionTime, { color: colors.textSecondary }]}>
                    {formatTime(session.start_time)} - {formatTime(session.end_time)}
                  </Text>
                </View>
              </View>

              <View style={styles.sessionRight}>
                <View style={styles.sessionDuration}>
                  <Text style={[styles.durationText, { color: colors.text }]}>
                    {t('common.minutes', { count: session.duration_minutes })}
                  </Text>
                  {session.completed ? (
                    <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                  ) : (
                    <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
                  )}
                </View>

                {/* 删除按钮 */}
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteSession(session.id)}
                >
                  <Ionicons name="trash-outline" size={20} color={colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overviewCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
  },
  overviewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  overviewGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  overviewItem: {
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  overviewValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  overviewLabel: {
    fontSize: 13,
  },
  sessionsSection: {
    padding: 16,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 48,
    borderRadius: 16,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    fontWeight: '600',
  },
  emptyHint: {
    fontSize: 14,
    marginTop: 8,
  },
  sessionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  sessionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sessionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  sessionTime: {
    fontSize: 13,
  },
  sessionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sessionDuration: {
    alignItems: 'flex-end',
    gap: 4,
  },
  durationText: {
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    padding: 8,
  },
});
