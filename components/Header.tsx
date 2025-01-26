import React from 'react';
import { useTheme, Appbar, TouchableRipple, Switch } from 'react-native-paper';
import { usePreferences } from '@/contexts/preferencesContext';

export const Header = () => {
  const theme = useTheme();
  const { toggleTheme, isThemeDark } = usePreferences();

  return (
    <Appbar.Header
      theme={{
        colors: {
          primary: theme?.colors.surface,
        },
      }}
    >
      <Appbar.Content title="toggle dark mode" />
      <Switch color={'red'} value={isThemeDark} onValueChange={toggleTheme} />
    </Appbar.Header>
  );
};
