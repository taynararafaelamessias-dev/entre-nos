import { LOCALES } from '@entre-nos/i18n';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocale } from './LocaleProvider.tsx';

export function LanguageToggle() {
  const { locale, setLocale, t } = useLocale();
  return (
    <View accessibilityLabel={t('language.label')} style={styles.row}>
      {LOCALES.map((option) => {
        const selected = locale === option;
        return (
          <Pressable
            key={option}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => setLocale(option)}
            style={[styles.option, selected && styles.optionSelected]}
            testID={`lang-${option}`}
          >
            <Text style={[styles.label, selected && styles.labelSelected]}>{option.toUpperCase()}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  option: {
    borderColor: '#352b2b',
    borderRadius: 6,
    borderWidth: 1,
    minHeight: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  optionSelected: { borderColor: '#c8a15a' },
  label: { color: '#a69c99', fontSize: 14, fontWeight: '600' },
  labelSelected: { color: '#f2ebe5' },
});
