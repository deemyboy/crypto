import React, { useState } from 'react';
import { StyleSheet, Dimensions, View, ViewStyle } from 'react-native';
import { useTheme, Appbar, Switch, Text, Checkbox } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCoins } from '@/contexts/coinsContext';
import { DEFAULT, SPECS_CURRENCIES, SPECS_TICKERS } from '@/constants/Api';
import { useTickerData } from '@/hooks/useTickerData';
import { TrendBox } from '@/components/trend-box';

const Settings = () => {
  const theme = useTheme();

  const { colors } = theme;
  const { tickerOptions } = useCoins();
  const { tickers, currencies } = useTickerData();

  const { selectableTickers, setSelectableTickers, selectableCurrencies, setSelectableCurrencies } = useCoins();
  console.log('🚀  |  file: settings.tsx:19  |  Settings  |  tickers:', tickers);
  const [checked, setChecked] = useState(false);
  const [tempSelectableTickers, setTempSelectableTickers] = useState(selectableTickers);
  console.log('🚀  |  file: settings.tsx:23  |  Settings  |  tempSelectableTickers:', tempSelectableTickers);
  const [tempSelectableCurrencies, setTempSelectableCurrencies] = useState(selectableCurrencies);
  console.log('🚀  |  file: settings.tsx:25  |  Settings  |  tempSelectableCurrencies:', tempSelectableCurrencies);

  return (
    <>
      <LinearGradient
        start={[0.9, 0.4]}
        end={[0.4, 0.9]}
        colors={[colors.surface, colors.onSurfaceVariant, colors.onSurfaceDisabled]}
        style={styles.gradient}
      >
        <View style={styles.container}>
          <Text>Settings</Text>

          {/* Tickers Panel */}
          <View style={styles.tickersPanel}>
            <Text>Tickers</Text>
            {tickers.map((ticker) => (
              <View key={ticker.key} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                <Checkbox
                  status={checked ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setTempSelectableTickers((prev) =>
                      prev.includes(ticker) ? prev.filter((t) => t !== ticker) : [...prev, ticker]
                    );
                  }}
                  uncheckedColor={colors.onPrimary}
                />
                <Text style={{ color: colors.onPrimary, marginLeft: 5 }}>{ticker.value.toUpperCase()}</Text>
              </View>
            ))}
          </View>

          {/* Currencies Panel */}
          <View style={styles.currenciesPanel}>
            <Text>Currencies</Text>
            {currencies.map((currency) => (
              <View key={currency.key} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                <Checkbox
                  status={checked ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setTempSelectableCurrencies((prev) =>
                      prev.includes(currency) ? prev.filter((t) => t !== currency) : [...prev, currency]
                    );
                  }}
                  uncheckedColor={colors.onPrimary}
                />
                <Text style={{ color: colors.onPrimary, marginLeft: 5 }}>{currency.value.toUpperCase()}</Text>
              </View>
            ))}
          </View>
        </View>
      </LinearGradient>
    </>
  );
};

export default Settings;

const styles = StyleSheet.create<{
  gradient: ViewStyle;
  container: ViewStyle;
  dropdownBox: ViewStyle;
  dropdownPicker: ViewStyle;
  dataBox: ViewStyle;
  currencySelectorBox: ViewStyle;
  tickersPanel: ViewStyle;
  currenciesPanel: ViewStyle;
}>({
  gradient: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  container: {
    width: Dimensions.get('screen').width * 0.8,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
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
  },
  currencySelectorBox: {
    marginTop: 16,
    alignItems: 'center',
  },
  tickersPanel: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 10,
    borderColor: 'pink',
    borderWidth: 1,
  },

  currenciesPanel: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
    borderColor: 'orange',
    borderWidth: 1,
  },

  // tickersPanel: {
  //   // width: Dimensions.get('screen').width * 0.8,
  //   // flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: 'transparent',
  //   flexDirection: 'column',
  //   // flexWrap: 'wrap',
  //   borderColor: 'pink',
  //   borderWidth: 1,
  // },
  // currenciesPanel: {
  //   // width: Dimensions.get('screen').width * 0.8,
  //   // flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: 'transparent',
  //   flexDirection: 'column',
  //   // flexWrap: 'wrap',
  //   borderColor: 'orange',
  //   borderWidth: 1,
  // },
});
