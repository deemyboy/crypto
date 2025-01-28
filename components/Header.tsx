import React from 'react';
import { useTheme, Appbar, TouchableRipple, Switch } from 'react-native-paper';
import { usePreferences } from '@/contexts/preferencesContext';

export const Header = () => {
  const theme = useTheme();
  const { toggleTheme, isThemeDark } = usePreferences();

  return (
    <Appbar.Header style={{ backgroundColor: theme.colors.background }}>
      <Appbar.Content
        title="Dark Mode"
        style={{ backgroundColor: theme.colors.background }}
        titleStyle={{ marginLeft: 200, color: theme.colors.primary }}
      />
      <Switch color={theme.colors.primary} value={isThemeDark} onValueChange={toggleTheme} />
    </Appbar.Header>
  );
};
