import React, { useState } from 'react';
import { SegmentedButtons, useTheme } from 'react-native-paper';

import { SPECS_CURRENCIES } from '@/constants/Api';
import { useCoins } from '@/contexts/coinsContext';
import { CurrencyKey, CurrencyValue } from '@/types/types';
import { CUSTOM_CORNER_RADIUS } from '@/constants/sizes';

export const CurrencySelector: React.FC = () => {
  const { handleCurrencyChange, coinState, selectedCurrenciesForUI } = useCoins();
  const theme = useTheme();
  const { colors } = theme;
  const currencies = Object.entries(selectedCurrenciesForUI) as [CurrencyKey, CurrencyValue][];
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyKey | null>(coinState.currencyKey);

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
        index === 0 // this setup allows the end corner radius to match regardless of the number of currencies
          ? { borderTopLeftRadius: CUSTOM_CORNER_RADIUS, borderBottomLeftRadius: CUSTOM_CORNER_RADIUS }
          : index === (currencies?.length ?? 0) - 1
          ? { borderTopRightRadius: CUSTOM_CORNER_RADIUS, borderBottomRightRadius: CUSTOM_CORNER_RADIUS }
          : {},
      ],
    };
  });

  const chooseCurrency = (chosenCurrency: string | undefined) => {
    if (!chosenCurrency || !(chosenCurrency in selectedCurrenciesForUI)) {
      return;
    }

    handleCurrencyChange(chosenCurrency as CurrencyKey);
  };

  return (
    <SegmentedButtons
      value={selectedCurrency!}
      onValueChange={(chosenCurrency) => {
        setSelectedCurrency(chosenCurrency as CurrencyKey);
        chooseCurrency(chosenCurrency);
      }}
      // @ts-ignore - far too complex to debug or type!
      buttons={currencyButtons}
      style={{
        borderTopRightRadius: CUSTOM_CORNER_RADIUS,
        borderTopLeftRadius: CUSTOM_CORNER_RADIUS,
        borderBottomRightRadius: CUSTOM_CORNER_RADIUS,
        borderBottomLeftRadius: CUSTOM_CORNER_RADIUS,
      }}
    />
  );
};
