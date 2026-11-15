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
  const tone = state === 'up' ? 'up' : state === 'checking' ? 'neutral' : 'bad';

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.wordmark}>Entre Nós</Text>
        <LanguageToggle />
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>{t('home.title')}</Text>
        <Text style={styles.lead}>{t('home.lead')}</Text>
        <View style={styles.statusCard}>
          <View style={[styles.dot, tone === 'up' && styles.dotUp, tone === 'bad' && styles.dotBad]} />
          <Text
            accessibilityLiveRegion="polite"
            style={[styles.status, tone !== 'neutral' && styles.statusStrong]}
            testID="health-status"
          >
            {t(`health.${state}`)}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0d0a0a',
    // Brilho vinho do app antigo: o fundo não fica chapado.
    experimental_backgroundImage:
      'radial-gradient(circle at 50% -10%, #3a0f15 0%, transparent 55%), radial-gradient(circle at 100% 110%, #1e1414 0%, transparent 50%)',
    paddingHorizontal: 24,
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 },
  wordmark: { color: '#f2ebe5', fontSize: 20, fontWeight: '600', letterSpacing: 0.2 },
  body: { flex: 1, justifyContent: 'center', gap: 14, paddingBottom: 48 },
  title: { color: '#f2ebe5', fontSize: 44, fontWeight: '700', letterSpacing: -0.8, lineHeight: 50 },
  lead: { color: '#a69c99', fontSize: 18, lineHeight: 26 },
  statusCard: {
    marginTop: 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    alignSelf: 'flex-start',
    backgroundColor: '#191414',
    borderColor: '#352b2b',
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#a69c99' },
  dotUp: { backgroundColor: '#c8a15a' },
  dotBad: { backgroundColor: '#a01e2b' },
  status: { color: '#a69c99', fontSize: 16, flexShrink: 1 },
  statusStrong: { color: '#f2ebe5' },
});
