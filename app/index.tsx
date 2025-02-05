import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Dimensions, View, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import { LinearGradient } from 'expo-linear-gradient';
import AntDesign from '@expo/vector-icons/AntDesign';

import { DEFAULT, SPECS_TICKERS } from '@/constants/Api';
import { DataBox } from '@/components/data-box';
import { CurrencySelector } from '@/components/currency-selector';
import { useCoins } from '@/contexts/coinsContext';
import { TickerKey } from '@/types/types';
import { TickerPicker } from '@/components/ticker-picker';

export default function HomeScreen() {
  const { tickerOptions, handleTickerSelect, coinState } = useCoins();

  const theme = useTheme();
  const { colors } = theme;

  return (
    <>
      <LinearGradient
        start={[0.9, 0.4]}
        end={[0.4, 0.9]}
        colors={[colors.surface, colors.onSurfaceVariant]}
        style={styles.gradient}
      >
        <View style={[styles.container, {}]}>
          <View style={styles.dropdownBox}>
            {tickerOptions ? (
              <TickerPicker
                tickerKey={coinState.tickerKey}
                onTickerChange={handleTickerSelect}
                options={tickerOptions}
              />
            ) : (
              <></>
            )}
          </View>
          <View style={[styles.dataBox, {}]}>
            <DataBox />
          </View>
          <View style={[styles.currencySelectorBox, {}]}>
            <CurrencySelector />
          </View>
        </View>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create<{
  gradient: ViewStyle;
  container: ViewStyle;
  dropdownBox: ViewStyle;
  dropdownPicker: ViewStyle;
  dataBox: ViewStyle;
  currencySelectorBox: ViewStyle;
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
});
