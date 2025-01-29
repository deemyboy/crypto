import React, { useState } from 'react';
import { SegmentedButtons, useTheme } from 'react-native-paper';

import { DEFAULT, SPECS_CURRENCIES } from '@/constants/Api';
import { useCoins } from '@/contexts/coinsContext';
import { TCurrencyKey, TCurrencyValue } from '@/types/types';

export const CurrencySelector: React.FC = () => {
  const { currency, handleCurrencyChange } = useCoins();
  const theme = useTheme();
  const { colors } = theme;
  const [selectedCurrency, setSelectedCurrency] = useState<TCurrencyKey | null>(DEFAULT.currencyKey);
  const currencies = Object.entries(SPECS_CURRENCIES) as [TCurrencyKey, TCurrencyValue][];

  const currencyButtons = currencies.map(([key, label]) => ({
    value: key,
    label: label,
    icon: selectedCurrency === key ? 'check' : '',
    checkedColor: colors.onPrimary,
    uncheckedColor: colors.onBackground,
    checked: selectedCurrency === key,
    onPress: () => setSelectedCurrency(key),
    style: {
      borderColor: colors.primary,
      borderWidth: 2,
    },
  }));

  const chooseCurrency = (chosenCurrency: string | undefined) => {
    if (!chosenCurrency || !(chosenCurrency in SPECS_CURRENCIES)) {
      return;
    }

    handleCurrencyChange(chosenCurrency as TCurrencyKey);
  };

  return <SegmentedButtons value={currency} onValueChange={chooseCurrency} buttons={currencyButtons} style={{}} />;
};
