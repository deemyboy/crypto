import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Dimensions, View, TouchableOpacity } from 'react-native';
import {
  Text,
  ActivityIndicator,
  SegmentedButtons,
  useTheme,
} from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';

import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import moment from 'moment';

import { SPECS_CURRENCIES, SPECS_TICKERS } from '@/constants/Api';

import { useCoins } from '@/contexts/coinsContext';
import { Header } from '@/components/Header';
import { usePreferences } from '@/contexts/preferencesContext';
import { TCurrency, TCurrencyKey, TTickerKey, Option } from '@/types/types';

export default function HomeScreen() {
  const {
    currency,
    setCurrencyKey,
    price,
    selectedTickerOption,
    ticker,
    tickerKey,
    setTickerKey,
    refreshing,
    setRefreshing,
    tickerOptions,
    tickerData,
    fetchingData,
    handleTickerSelect,
    handleCurrencyChange,
    combinedTickerData,
  } = useCoins();

  // const refDropdown1 = useRef<DropdownRef>(null);
  const [timeAgo, setTimeAgo] = useState('');
  // const [currency, setCurrency] = useState<TCurrency>('usd');
  // const [price, setPrice] = useState<string>('0');

  const theme = useTheme();
  const { colors } = theme;

  const { isThemeDark } = usePreferences();

  const makeTimeAgo = (timestamp: string | number | Date): void => {
    const date = moment(timestamp);

    if (!date.isValid()) {
      throw new Error('Invalid timestamp');
    }

    setTimeAgo(date.fromNow());
  };

  useEffect(() => {
    if (tickerData) makeTimeAgo(tickerData.last_updated);
  }, [tickerData]);

  const chooseCurrency = (chosenCurrency: string | undefined) => {
    if (!chosenCurrency || !(chosenCurrency in SPECS_CURRENCIES)) {
      return; // Ignore invalid or undefined values
    }

    // Cast the value to TCurrencyKey
    setCurrencyKey(chosenCurrency as TCurrencyKey);
  };

  const chooseTicker = (value: string | undefined) => {
    console.log('🚀  |  file: index.tsx:91  |  chooseTicker  |  value:', value);
    if (!value || !(value in SPECS_TICKERS)) {
      return; // Ignore invalid or undefined values
    }

    // Cast the value to the appropriate type
    handleTickerSelect(value as TTickerKey);
  };

  const [isFocus, setIsFocus] = useState(false);

  const renderLabel = () => {
    if (tickerKey || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: 'blue' }]}>
          Dropdown label
        </Text>
      );
    }
    return null;
  };

  return (
    <>
      <Header />
      <View style={[styles.screen, {}]}>
        <View style={styles.content}>
          <View style={styles.dropdown}>
            {console.log('104 Dropdown tickerKey:', tickerKey)}

            {renderLabel()}
            {tickerOptions && tickerOptions.length > 0 ? (
              // <Dropdown
              //   ref={refDropdown1}
              //   placeholder={'Select Currency'}
              //   options={tickerOptions}
              //   value={tickerKey || ''}
              //   onSelect={chooseTicker}
              //   mode="outlined"
              // />

              <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={tickerOptions}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Select item' : '...'}
                searchPlaceholder="Search..."
                value={tickerKey}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={(item) => {
                  console.log(
                    '🚀  |  file: index.tsx:133  |  HomeScreen  |  item:',
                    item
                  );
                  handleTickerSelect(item.value);
                  setIsFocus(false);
                }}
              />
            ) : (
              <></>
            )}
          </View>

          <View style={styles.dataBox}>
            <LinearGradient
              start={[0.4, 0.9]}
              end={[0.9, 0.4]}
              colors={['#fb7bb3', '#fb93a3', '#f9a19a']}
              style={styles.linearGradientDataBox}
            >
              <Text
                style={{
                  fontFamily: 'Roboto_500Medium',
                }}
                variant="titleSmall"
              >
                {selectedTickerOption?.label}
              </Text>
              <TouchableOpacity
                onPress={() => setRefreshing(true)}
                style={styles.refresher}
              >
                <Ionicons
                  name="reload"
                  size={32}
                  color={colors.onPrimary}
                  prop={{ ltr: false }}
                />
              </TouchableOpacity>
              <View style={{ backgroundColor: 'pink' }}>
                {!refreshing && price ? (
                  <Text
                    style={{
                      fontFamily: 'Roboto_700Bold',
                      color: colors.onPrimary,
                    }}
                    variant="displaySmall"
                  >
                    {price}
                  </Text>
                ) : (
                  <View style={{}}>
                    <ActivityIndicator
                      animating={true}
                      color={isThemeDark ? 'white' : 'black'}
                    />
                  </View>
                )}
              </View>
              <Text style={styles.dateTime} variant="bodySmall">
                {timeAgo}
              </Text>
            </LinearGradient>
          </View>
          <SegmentedButtons
            value={currency}
            onValueChange={chooseCurrency}
            buttons={[
              {
                value: 'gbp',
                label: SPECS_CURRENCIES.gbp,
              },
              {
                value: 'usd',
                label: SPECS_CURRENCIES.usd,
              },
            ]}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'orange',
    // width: Dimensions.get('screen').width * 0.9,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('screen').width * 0.8,
    backgroundColor: 'green',
  },
  dropdown: {
    // flex: 1,
    // justifyContent: 'center',
    width: Dimensions.get('screen').width * 0.8,
    // height: Dimensions.get('screen').height * 0.2,
    marginBottom: 16,
    backgroundColor: 'grey',
    paddingVertical: 10,
  },
  dataBox: {
    // flex: 1,
    width: Dimensions.get('screen').width * 0.8,
    height: Dimensions.get('screen').height * 0.3,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    // justifyContent: 'center',
    marginVertical: 16,
    backgroundColor: 'yellow',
  },
  linearGradientDataBox: {
    flex: 1,
    height: Dimensions.get('screen').height * 0.3,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    // padding: 20,
    // borderRadius: 10,
  },
  refresher: {
    position: 'absolute',
    top: 3,
    right: 3,
    transform: [{ scaleX: -1 }],
  },
  dateTime: {
    fontFamily: 'Roboto_400Regular',
    marginTop: 8, // Spacing for the dateTime text
  },
  label: {},
  placeholderStyle: {},
  selectedTextStyle: {},
  inputSearchStyle: {},
  iconStyle: {},
  icon: {},
});
