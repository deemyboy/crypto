import React, { useState } from 'react';
import { SegmentedButtons, useTheme } from 'react-native-paper';

import { DEFAULT, SPECS_CURRENCIES } from '@/constants/Api';
import { useCoins } from '@/contexts/coinsContext';
import { TCurrencyKey, TCurrencyValue } from '@/types/types';

export const CurrencySelector: React.FC = () => {
  const { handleCurrencyChange } = useCoins();
  const theme = useTheme();
  const { colors } = theme;
  const currencies = Object.entries(SPECS_CURRENCIES) as [TCurrencyKey, TCurrencyValue][];
  const [selectedCurrency, setSelectedCurrency] = useState<TCurrencyKey | null>(DEFAULT.currencyKey);

  const currencyButtons = currencies.map(([key, label], index) => {
    const isChecked = selectedCurrency === key;

    return {
      value: key,
      label: label,
      icon: isChecked ? 'check' : '',
      checked: isChecked,
      onPress: () => {
        setSelectedCurrency(() => {
          return key;
        });
      },
      style: [
        {
          borderColor: colors.primary,
          borderWidth: 2,
          justifyContent: 'center',
          height: 50,
        },
        index === 0
          ? {
              borderTopLeftRadius: 40,
              borderBottomLeftRadius: 40,
            }
          : {
              borderTopRightRadius: 40,
              borderBottomRightRadius: 40,
            },
      ],
    };
  });

  const chooseCurrency = (chosenCurrency: string | undefined) => {
    if (!chosenCurrency || !(chosenCurrency in SPECS_CURRENCIES)) {
      return;
    }

    handleCurrencyChange(chosenCurrency as TCurrencyKey);
  };

  return (
    <SegmentedButtons
      value={selectedCurrency!}
      onValueChange={(chosenCurrency) => {
        setSelectedCurrency(chosenCurrency as TCurrencyKey);
        chooseCurrency(chosenCurrency);
      }}
      // @ts-ignore - far too complex to debug or type!
      buttons={currencyButtons}
      style={{
        borderTopRightRadius: 40,
        borderTopLeftRadius: 40,
        borderBottomRightRadius: 40,
        borderBottomLeftRadius: 40,
      }}
    />
  );
};
