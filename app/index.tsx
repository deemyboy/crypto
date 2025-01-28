import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, View, TextStyle, ViewStyle } from 'react-native';
import { SegmentedButtons, useTheme } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';

import { DEFAULT, SPECS_CURRENCIES, SPECS_TICKERS } from '@/constants/Api';

import { useCoins } from '@/contexts/coinsContext';
import { TCurrencyKey, TTickerKey, TCurrencyValue } from '@/types/types';
import { DataBox } from '@/components/data-box';

export default function HomeScreen() {
  const { currency, tickerOptions, handleTickerSelect, handleCurrencyChange } = useCoins();

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

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [items, setItems] = useState(tickerOptions);

  const chooseCurrency = (chosenCurrency: string | undefined) => {
    if (!chosenCurrency || !(chosenCurrency in SPECS_CURRENCIES)) {
      return;
    }

    handleCurrencyChange(chosenCurrency as TCurrencyKey);
  };

  const chooseTicker = (value: string | undefined) => {
    if (!value || !(value in SPECS_TICKERS)) {
      return;
    }

    handleTickerSelect(value as TTickerKey);
  };

  useEffect(() => {
    if (!value) setValue(DEFAULT.tickerKey);
  }, []);

  useEffect(() => {
    if (tickerOptions && tickerOptions.length > 0) {
      setItems(tickerOptions);
    }
  }, [tickerOptions]);
  useEffect(() => {
    chooseTicker(value!);
  }, [value]);

  return (
    <>
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <View style={[styles.content, { backgroundColor: colors.background }]}>
          <View style={styles.dropdownBox}>
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              containerStyle={{}}
              style={[
                styles.dropdownPicker,
                {
                  borderColor: colors.primary,
                  backgroundColor: colors.background,
                },
              ]}
              textStyle={{
                paddingLeft: 10,
                color: colors.onBackground,
                fontFamily: 'Roboto_500Medium',
              }}
              //  @ts-ignore
              tickIconStyle={{ tintColor: colors.onBackground }}
              //  @ts-ignore
              arrowIconStyle={{ tintColor: colors.onBackground }}
            />
          </View>
          <View style={[styles.dataBox, {}]}>
            <DataBox />
          </View>
          <View style={[styles.currencyButtonsBox, {}]}>
            <SegmentedButtons value={currency} onValueChange={chooseCurrency} buttons={currencyButtons} style={{}} />
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create<{
  screen: ViewStyle;
  content: ViewStyle;
  dropdownBox: ViewStyle;
  dropdownPicker: ViewStyle;
  dataBox: ViewStyle;
  currencyButtonsBox: ViewStyle;
  trends: ViewStyle;
  trendBox: TextStyle;
}>({
  screen: {
    flex: 1,
    alignItems: 'center',
  },
  content: {
    width: Dimensions.get('screen').width * 0.8,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownBox: {
    width: Dimensions.get('screen').width * 0.8,
    marginBottom: 16,
  },
  dropdownPicker: {
    height: 50,
    borderRadius: 40,
    borderWidth: 2,
  },
  dataBox: {
    width: Dimensions.get('screen').width * 0.8,
    height: Dimensions.get('screen').height * 0.25,
    borderRadius: 10,
    alignItems: 'center',
  },
  currencyButtonsBox: {
    marginTop: 16,
    alignItems: 'center',
  },
  trends: {
    alignItems: 'center',
  },
  trendBox: {
    fontFamily: 'Roboto_700Bold',
  },
});
