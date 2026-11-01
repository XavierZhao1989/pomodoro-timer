import { View, Text, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { format, subDays } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '@/hooks/useThemeColors';
import { storageAdapter } from '@/lib/storage';
import { PomodoroSession } from '@/types/models';

interface DayStat {
  dateKey: string;
  label: string;
  count: number;
  minutes: number;
}

const DAYS = 7;
const BAR_MAX_HEIGHT = 120;

/**
 * 最近 7 天专注趋势（只读，复用现有 getSessionsByDate，不改存储格式）
 * refreshKey 变化时重新加载（例如今日会话列表变化）
 */
export default function WeeklyFocusChart({ refreshKey }: { refreshKey: unknown }) {
  const { t } = useTranslation();
  const { colors } = useThemeColors();
  const [days, setDays] = useState<DayStat[]>([]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const now = Date.now();
        const keys = Array.from({ length: DAYS }, (_, i) => subDays(now, DAYS - 1 - i));
        const results = await Promise.all(
          keys.map((d) => storageAdapter.getSessionsByDate(format(d, 'yyyy-MM-dd')))
        );
        const stats = results.map((sessions: PomodoroSession[], i) => {
          const work = sessions.filter((s) => s.type === 'work' && s.completed);
          return {
            dateKey: format(keys[i], 'yyyy-MM-dd'),
            label: format(keys[i], 'M/d'),
            count: work.length,
            minutes: work.reduce((sum, s) => sum + s.duration_minutes, 0),
          };
        });
        if (!cancelled) setDays(stats);
      } catch (error) {
        console.error('Failed to load weekly stats:', error);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const maxMinutes = Math.max(1, ...days.map((d) => d.minutes));
  const totalMinutes = days.reduce((sum, d) => sum + d.minutes, 0);
  const totalCount = days.reduce((sum, d) => sum + d.count, 0);

  return (
    <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
      <Text style={[styles.title, { color: colors.text }]}>{t('stats.weekly.title')}</Text>
      <Text style={[styles.summary, { color: colors.textSecondary }]}>
        {t('stats.weekly.summary', { count: totalCount, minutes: totalMinutes })}
      </Text>

      <View style={styles.chart}>
        {days.map((d, i) => {
          const isToday = i === days.length - 1;
          const height = d.minutes > 0 ? Math.max(4, (d.minutes / maxMinutes) * BAR_MAX_HEIGHT) : 2;
          return (
            <View key={d.dateKey} style={styles.column}>
              <Text style={[styles.value, { color: colors.textSecondary }]}>
                {d.minutes > 0 ? d.minutes : ''}
              </Text>
              <View
                style={[
                  styles.bar,
                  {
                    height,
                    backgroundColor: d.minutes > 0 ? colors.working : colors.progressBackground,
                    opacity: isToday ? 1 : 0.75,
                  },
                ]}
              />
              <Text
                style={[
                  styles.label,
                  { color: isToday ? colors.text : colors.textTertiary },
                  isToday && styles.labelToday,
                ]}
              >
                {isToday ? t('stats.weekly.today') : d.label}
              </Text>
            </View>
          );
        })}
      </View>
      <Text style={[styles.unit, { color: colors.textTertiary }]}>{t('stats.weekly.unit')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summary: {
    fontSize: 13,
    marginBottom: 16,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: BAR_MAX_HEIGHT + 40,
  },
  column: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  value: {
    fontSize: 11,
    marginBottom: 4,
  },
  bar: {
    width: 18,
    borderRadius: 6,
  },
  label: {
    fontSize: 11,
    marginTop: 6,
  },
  labelToday: {
    fontWeight: '600',
  },
  unit: {
    fontSize: 11,
    marginTop: 8,
    textAlign: 'right',
  },
});
