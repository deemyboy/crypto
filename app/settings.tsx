import React from 'react';
import { StyleSheet, Dimensions, View, ViewStyle } from 'react-native';
import { useTheme, Text, Checkbox } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useCoins } from '@/contexts/coinsContext';
import { SPECS_CURRENCIES, SPECS_TICKERS } from '@/constants/Api';
import { useTickerData } from '@/hooks/useTickerData';
import { CurrencyKey, TickerKey } from '@/types/types';

const Settings = () => {
  const theme = useTheme();

  const { colors } = theme;
  const { tickerOptions } = useCoins();
  const { tickers, currencies } = useTickerData();

  const {
    availableCurrencies,
    availableTickers,
    setAvailableTickers,
    setAvailableCurrencies,
    setSelectedCurrenciesForUI,
    setSelectedTickersForUI,
  } = useCoins();

  return (
    <>
      <LinearGradient
        start={[0.9, 0.4]}
        end={[0.4, 0.9]}
        colors={[colors.surface, colors.onSurfaceVariant]}
        style={styles.gradient}
      >
        <View style={styles.container}>
          <Text>Settings</Text>

          {/* Tickers Panel */}
          <View style={styles.tickersPanel}>
            <Text>Tickers</Text>
            {Object.entries(SPECS_TICKERS).map(([tickerKey, tickerValue]) => {
              const isChecked = availableTickers[tickerKey as TickerKey];
              const selectedCount = Object.values(availableTickers).filter(Boolean).length;
              const disabled = isChecked && selectedCount === 1;

              return (
                <View key={tickerKey} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                  <Checkbox
                    status={isChecked ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setAvailableTickers((prev) => ({
                        ...prev,
                        [tickerKey as TickerKey]: !isChecked,
                      }));
                    }}
                    uncheckedColor={colors.onPrimary}
                    disabled={disabled}
                  />
                  {/* @ts-ignore */}
                  <Text style={{ color: disabled ? colors.checkboxDisabled : colors.onPrimary, marginLeft: 5 }}>
                    {tickerValue.toUpperCase()}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Currencies Panel */}
          <View style={styles.currenciesPanel}>
            <Text>Currencies</Text>
            {Object.entries(SPECS_CURRENCIES).map(([currencyKey, currencyValue]) => {
              const isChecked = availableCurrencies[currencyKey as CurrencyKey];
              const selectedCount = Object.values(availableCurrencies).filter(Boolean).length;
              const disabled = (isChecked && selectedCount === 2) || (!isChecked && selectedCount === 3);
              return (
                <View key={currencyKey} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                  <Checkbox
                    status={isChecked ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setAvailableCurrencies((prev) => ({
                        ...prev,
                        [currencyKey as CurrencyKey]: !isChecked,
                      }));
                    }}
                    uncheckedColor={colors.onPrimary}
                    disabled={disabled}
                  />
                  {/* @ts-ignore */}
                  <Text style={{ color: disabled ? colors.checkboxDisabled : colors.onPrimary, marginLeft: 5 }}>
                    {currencyValue.toUpperCase()}
                  </Text>
                </View>
              );
            })}
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
});
