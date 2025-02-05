import React, { useEffect, useState } from 'react';
import { SegmentedButtons, useTheme } from 'react-native-paper';

import { useCoins } from '@/contexts/coinsContext';
import { CurrencyKey } from '@/types/types';
import { CUSTOM_CORNER_RADIUS } from '@/constants/sizes';
import { getCurrency } from '@/utils/utils';

export const CurrencySelector: React.FC = () => {
  const { handleCurrencyChange, selectedCurrenciesForUI } = useCoins();
  const theme = useTheme();
  const { colors } = theme;
  const currencies: CurrencyKey[] = selectedCurrenciesForUI;

  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyKey | null>(
    currencies.length > 0 ? currencies[0] : null
  );

  useEffect(() => {
    if (!selectedCurrency || !currencies.includes(selectedCurrency)) {
      const firstAvailableCurrency = currencies.length > 0 ? currencies[0] : null;
      setSelectedCurrency(firstAvailableCurrency);

      if (firstAvailableCurrency) {
        handleCurrencyChange(firstAvailableCurrency);
      }
    }
  }, [selectedCurrenciesForUI, selectedCurrency, currencies]);

  const currencyButtons = currencies.map((key, index) => {
    const isChecked = selectedCurrency === key;
    const typedKey: CurrencyKey = key;
    return {
      value: key,
      label: getCurrency(typedKey),
      icon: isChecked ? 'check' : '',
      checked: isChecked,
      onPress: () => {
        setSelectedCurrency(typedKey);
        handleCurrencyChange(typedKey);
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

  return (
    <SegmentedButtons
      value={selectedCurrency!}
      onValueChange={(chosenCurrency) => {
        setSelectedCurrency(chosenCurrency as CurrencyKey);
        handleCurrencyChange(chosenCurrency as CurrencyKey);
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
