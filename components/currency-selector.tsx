import React, { useEffect, useState } from 'react';
import { SegmentedButtons, useTheme } from 'react-native-paper';

import { useCoins } from '@/contexts/coinsContext';
import { CUSTOM_CORNER_RADIUS } from '@/constants/sizes';
import { getCurrency } from '@/utils/utils';
import { CurrencyKey } from '@/types/types';

export const CurrencySelector: React.FC = () => {
  const { handleCurrencyChange, selectedCurrenciesForUI, coinState, setCoinState } = useCoins();
  const theme = useTheme();
  const { colors } = theme;
  const currencies: CurrencyKey[] = selectedCurrenciesForUI;

  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyKey | null>(
    coinState.currencyKey || (currencies.length > 0 ? currencies[0] : null)
  );

  useEffect(() => {
    if (!selectedCurrency || !selectedCurrenciesForUI.includes(selectedCurrency)) {
      const currencyToSet = coinState.currencyKey || selectedCurrenciesForUI[0];
      setSelectedCurrency(currencyToSet);
      handleCurrencyChange(currencyToSet);
    }

    if (!selectedCurrenciesForUI.includes(coinState.currencyKey)) {
      const newCurrencyKey = selectedCurrenciesForUI[0] || null;
      setCoinState((prevState) => ({
        ...prevState,
        currencyKey: newCurrencyKey,
      }));
    }
  }, [selectedCurrenciesForUI, coinState.currencyKey, selectedCurrency]);

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
        // this setup allows the end corner radius to match regardless of the number of currencies
        index === 0
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
