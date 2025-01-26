import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';

import { CoinsProvider } from '@/contexts/coinsContext';
import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto';

import {
  PreferencesProvider,
  usePreferences,
} from '@/contexts/preferencesContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });

  const { isThemeDark } = usePreferences();

  const baseTheme = isThemeDark ? MD3DarkTheme : MD3LightTheme;

  const Theme = {
    ...baseTheme,
    fonts: {
      ...baseTheme.fonts,
      regular: { fontFamily: 'Roboto_400Regular', fontWeight: 'normal' },
      medium: { fontFamily: 'Roboto_500Medium', fontWeight: '500' },
      bold: { fontFamily: 'Roboto_700Bold', fontWeight: 'bold' },
    },
    colors: {
      background: isThemeDark ? '#091251' : '#1328b4',
    },
  };

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <PaperProvider theme={Theme}>
      <CoinsProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
      </CoinsProvider>
    </PaperProvider>
  );
}
