import React, { useCallback, useContext, useMemo, useState } from 'react';

import { PreferencesContextType } from '@/types/types';

export const PreferencesContext = React.createContext<PreferencesContextType>({
  isThemeDark: false,
  toggleTheme: () => {},
});

export const usePreferences = () => {
  return useContext(PreferencesContext);
};

export const PreferencesProvider = ({ children }: any) => {
  const [isThemeDark, setIsThemeDark] = useState(true);

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
