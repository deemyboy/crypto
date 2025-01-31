import React from 'react';
import { useTheme, Appbar, Switch } from 'react-native-paper';

import { usePreferences } from '@/contexts/preferencesContext';

export const Header = () => {
  const theme = useTheme();
  const { toggleTheme, isThemeDark } = usePreferences();

  return (
    <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
      <Appbar.Content
        title="Dark Mode"
        style={{ backgroundColor: 'transparent' }}
        titleStyle={[
          {
            alignSelf: 'flex-end',
            color: theme.colors.primary,
            fontFamily: 'Roboto_500Medium',
            position: 'relative',
            bottom: 2,
            marginRight: 10,
          },
        ]}
      />
      <Switch color={theme.colors.primary} value={isThemeDark} onValueChange={toggleTheme} />
    </Appbar.Header>
  );
};
