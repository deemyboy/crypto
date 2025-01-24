import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  Text,
  ActivityIndicator,
  SegmentedButtons,
} from 'react-native-paper';

import { useColorScheme } from '@/hooks/useColorScheme';
import { CoinsProvider } from '@/contexts/coinsContext';
import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });

  const [isDark, setIsDark] = useState(true);

  const baseTheme = colorScheme === 'dark' ? MD3DarkTheme : MD3LightTheme;

  const Theme = {
    ...baseTheme,
    fonts: {
      ...baseTheme.fonts,
      regular: { fontFamily: 'Roboto_400Regular', fontWeight: 'normal' },
      medium: { fontFamily: 'Roboto_500Medium', fontWeight: '500' },
      bold: { fontFamily: 'Roboto_700Bold', fontWeight: 'bold' },
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
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </CoinsProvider>
    </PaperProvider>
  );
}
