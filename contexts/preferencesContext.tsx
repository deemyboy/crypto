import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { getStoredValue, storeValue } from '@/storage/storage';
import { debounce } from '../utils/utils';
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

  const loadPersistedThemeSetting = () => {
    const storedIsThemeDark = getStoredValue('isThemeDark');

    if (storedIsThemeDark) {
      storedIsThemeDark === 'true' ? setIsThemeDark(true) : setIsThemeDark(false);
    }
  };

  const saveIsThemeDarkDebounced = useCallback(
    debounce(() => saveisThemeDark(), 100),
    [isThemeDark]
  );

  useEffect(() => {
    saveIsThemeDarkDebounced();
  }, [isThemeDark]);

  const saveisThemeDark = () => {
    setIsThemeDark((prev) => {
      const _isDark = prev ? 'true' : 'false';
      storeValue('isThemeDark', _isDark);
      return prev;
    });
  };

  const toggleTheme = useCallback(() => {
    {
      setIsThemeDark(!isThemeDark);
    }
  }, [isThemeDark]);

  useEffect(() => {
    loadPersistedThemeSetting();
  }, []);

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
