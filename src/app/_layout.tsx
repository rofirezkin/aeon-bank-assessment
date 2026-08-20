import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { BackButton } from '@/components/back-button/back-button';
import { Colors } from '@/constants/theme';
import { AppWrapper } from '@/context/client-provider';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
          <AppWrapper>
            <Stack
              screenOptions={{
                contentStyle: { backgroundColor: theme.background },
                headerStyle: { backgroundColor: theme.background },
                headerTitleStyle: { color: theme.text },
                headerShadowVisible: false,
              }}>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen
                name="transaction-detail"
                options={{
                  title: 'Transfer Details',
                  headerBackVisible: false,
                  headerLeft: () => <BackButton />,
                }}
              />
            </Stack>

            <StatusBar style="auto" />
          </AppWrapper>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
