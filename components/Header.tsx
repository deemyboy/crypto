import React from 'react';
import { useTheme, Appbar, Switch } from 'react-native-paper';
import { usePathname, useRouter } from 'expo-router';
import { usePreferences } from '@/contexts/preferencesContext';

export const Header = () => {
  const theme = useTheme();
  const { toggleTheme, isThemeDark } = usePreferences();
  const router = useRouter();
  const pathName = usePathname();

  const isOnSettings = pathName === '/settings';

  return (
    <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
      <Appbar.Action
        icon={isOnSettings ? 'window-close' : 'settings-helper'}
        size={30}
        color={theme.colors.primary}
        onPress={() => (isOnSettings ? router.back() : router.push('/settings'))}
        style={{ position: 'relative', bottom: !isOnSettings ? 16 : 0 }}
      />
      {!isOnSettings ? (
        <>
          <Appbar.Content
            title="Dark"
            titleStyle={{
              alignSelf: 'flex-end',
              color: theme.colors.primary,
              fontFamily: 'Roboto_500Medium',
              marginRight: 10,
            }}
          />
          <Switch color={theme.colors.primary} value={isThemeDark} onValueChange={toggleTheme} />
        </>
      ) : (
        <></>
      )}
    </Appbar.Header>
  );
};
