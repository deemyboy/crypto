import { TPreferencesContext } from '@/types/types';
import React, { useCallback, useContext, useMemo, useState } from 'react';

export const PreferencesContext = React.createContext<TPreferencesContext>({
  isThemeDark: false,
  toggleTheme: () => {},
});

export const usePreferences = () => {
  return useContext(PreferencesContext);
};

export const PreferencesProvider = ({ children }: any) => {
  const [isThemeDark, setIsThemeDark] = useState(false);

  const toggleTheme = useCallback(() => {
    return setIsThemeDark(!isThemeDark);
  }, [isThemeDark]);

  const preferences = useMemo(
    () => ({
      toggleTheme,
      isThemeDark,
    }),
    [toggleTheme, isThemeDark]
  );

  return (
    <PreferencesContext.Provider
      value={{
        toggleTheme,
        isThemeDark,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};
