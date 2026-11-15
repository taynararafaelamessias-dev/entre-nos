import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LocaleProvider } from '../i18n/LocaleProvider.tsx';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <LocaleProvider>
          <Stack screenOptions={{ headerShown: false }} />
          <StatusBar style="light" />
        </LocaleProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
