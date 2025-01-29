import React from 'react';
import { Platform } from 'react-native';
import { useTheme, Appbar, Switch } from 'react-native-paper';

import { usePreferences } from '@/contexts/preferencesContext';

export const Header = () => {
  const theme = useTheme();
  const { toggleTheme, isThemeDark } = usePreferences();

  return (
    <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
      <Appbar.Content
        title="Dark Mode"
        style={{ backgroundColor: theme.colors.surface }}
        titleStyle={[
          {
            alignSelf: 'flex-end',
            color: theme.colors.primary,
            fontFamily: 'Roboto_500Medium',
            position: 'relative',
            bottom: 2,
          },
          Platform.OS === 'ios' ? { marginRight: 10 } : { marginRight: 0 },
        ]}
      />
      <Switch color={theme.colors.primary} value={isThemeDark} onValueChange={toggleTheme} />
    </Appbar.Header>
  );
};
