import { useEffect } from 'react';
import 'react-native-reanimated';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { Roboto_400Regular, Roboto_500Medium, Roboto_700Bold } from '@expo-google-fonts/roboto';

import { Header } from '@/components/Header';
import { CoinsProvider } from '@/contexts/coinsContext';
import { usePreferences } from '@/contexts/preferencesContext';
import { CustomColors } from '@/constants/custom-colors';

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
    colors: {
      ...baseTheme.colors,
      ...(isThemeDark ? CustomColors.dark : CustomColors.light),
    },
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
          <Stack.Screen
            name="index"
            options={{
              headerShown: true,
              header: () => <Header />,
            }}
          />
          <Stack.Screen
            name="settings"
            options={{
              headerShown: true,
              header: () => <Header />,
            }}
          />
        </Stack>
      </CoinsProvider>
    </PaperProvider>
  );
}
