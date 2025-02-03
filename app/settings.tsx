import React from 'react';
import { StyleSheet, Dimensions, View, ViewStyle } from 'react-native';
import { useTheme, Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useCoins } from '@/contexts/coinsContext';
import { SPECS_CURRENCIES, SPECS_TICKERS } from '@/constants/Api';
import { CheckboxList } from '@/components/checkbox-list';

const Settings = () => {
  const theme = useTheme();

  const { colors } = theme;

  const { availableCurrencies, availableTickers, setAvailableTickers, setAvailableCurrencies, coinState } = useCoins();

  return (
    <>
      <LinearGradient
        start={[0.9, 0.4]}
        end={[0.4, 0.9]}
        colors={[colors.surface, colors.onSurfaceVariant]}
        style={styles.container}
      >
        <View style={[styles.dataBox, {}]}>
          <View style={[styles.settingsBox, { borderColor: colors.onPrimary, borderWidth: 0 }]}>
            <Text
              style={{
                alignSelf: 'center',
                fontFamily: 'Roboto_700Bold',
                marginBottom: 20,
                color: colors.onPrimary,
              }}
              variant="titleLarge"
            >
              Choices
            </Text>

            {/* Tickers Panel */}
            <CheckboxList
              title="Coins"
              items={SPECS_TICKERS}
              selectedItems={availableTickers}
              setSelectedItems={setAvailableTickers}
              minSelection={1}
              selectedKey={coinState.tickerKey}
              style={styles.tickersPanel}
            />

            {/* Currencies Panel */}
            <CheckboxList
              title="Currencies"
              items={SPECS_CURRENCIES}
              selectedItems={availableCurrencies}
              setSelectedItems={setAvailableCurrencies}
              maxSelection={3}
              minSelection={2}
              selectedKey={coinState.currencyKey}
              style={styles.currenciesPanel}
            />
          </View>
        </View>
      </LinearGradient>
    </>
  );
};

export default Settings;

const styles = StyleSheet.create<{
  container: ViewStyle;
  dataBox: ViewStyle;
  settingsBox: ViewStyle;
  tickersPanel: ViewStyle;
  currenciesPanel: ViewStyle;
}>({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'gray',
  },
  dataBox: {
    width: Dimensions.get('screen').width * 0.8,
    height: Dimensions.get('screen').height * 0.75,
    borderRadius: 10,
    justifyContent: 'center',
  },
  settingsBox: {
    borderRadius: 10,
    height: '100%',
    padding: 10,
  },
  tickersPanel: {
    borderWidth: 1,
  },
  currenciesPanel: {
    borderWidth: 1,
  },
});
