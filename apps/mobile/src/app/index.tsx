import { useQuery } from '@tanstack/react-query';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiQuery } from '../api/client.ts';
import { healthState } from '../health/health-state.ts';
import { LanguageToggle } from '../i18n/LanguageToggle.tsx';
import { useLocale } from '../i18n/LocaleProvider.tsx';

export default function Home() {
  const { t } = useLocale();
  const health = useQuery({
    ...apiQuery.health.check.queryOptions(),
    refetchInterval: 5000,
    retry: false,
  });
  const state = healthState(health);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.wordmark}>Entre Nós</Text>
        <LanguageToggle />
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>{t('home.title')}</Text>
        <Text style={styles.lead}>{t('home.lead')}</Text>
        <Text
          accessibilityLiveRegion="polite"
          style={[styles.status, (state === 'down' || state === 'unreachable') && styles.statusBad, state === 'up' && styles.statusUp]}
          testID="health-status"
        >
          {t(`health.${state}`)}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0d0a0a', paddingHorizontal: 24 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 },
  wordmark: { color: '#f2ebe5', fontSize: 20, fontWeight: '600' },
  body: { flex: 1, justifyContent: 'center', gap: 16 },
  title: { color: '#f2ebe5', fontSize: 36, fontWeight: '700' },
  lead: { color: '#a69c99', fontSize: 18, lineHeight: 26 },
  status: { color: '#a69c99', fontSize: 16, marginTop: 24 },
  statusUp: { color: '#c8a15a' },
  statusBad: { color: '#a01e2b' },
});
