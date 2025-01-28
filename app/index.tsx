import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, View, TouchableOpacity, TextStyle, ViewStyle } from 'react-native';
import { Text, ActivityIndicator, SegmentedButtons, useTheme } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import { LinearGradient } from 'expo-linear-gradient';

import { DEFAULT, SPECS_CURRENCIES, SPECS_TICKERS } from '@/constants/Api';

import { useCoins } from '@/contexts/coinsContext';
import { TCurrencyKey, TTickerKey, TCurrencyValue } from '@/types/types';
import { useSharedValue, withSpring } from 'react-native-reanimated';
import { TogglePanel } from '../components/toggle-panel';
import { useTickerData } from '@/hooks/useTickerData';
import TimeAgo from '../components/time-ago';

export default function HomeScreen() {
  const {
    currency,
    selectedTickerOption,
    refreshing,
    setRefreshing,
    tickerOptions,
    handleTickerSelect,
    handleCurrencyChange,
  } = useCoins();

  const { timeAgo, percentChanges, price } = useTickerData();

  const theme = useTheme();
  const { colors } = theme;
  const [selectedCurrency, setSelectedCurrency] = useState<TCurrencyKey | null>(DEFAULT.currencyKey);
  const currencies = Object.entries(SPECS_CURRENCIES) as [TCurrencyKey, TCurrencyValue][];

  const currencyButtons = currencies.map(([key, label]) => ({
    value: key,
    label: label,
    icon: selectedCurrency === key ? 'check' : '',
    checkedColor: colors.onPrimary,
    uncheckedColor: colors.primary,
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
  const [trendsPanelOpen, setTrendsPanelOpen] = useState(false);

  const height = useSharedValue(1);

  const toggleTrendsPanel = () => {
    setTrendsPanelOpen(!trendsPanelOpen);
    height.value = withSpring(height.value + 50);
  };
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
          <View style={styles.dropdown}>
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              containerStyle={{}}
              style={{
                height: 50,
                borderRadius: 40,
                borderColor: colors.primary,
                borderWidth: 2,
                backgroundColor: colors.background,
              }}
              textStyle={{
                paddingLeft: 10,
                color: colors.primary,
                fontFamily: 'Roboto_500Medium',
              }}
              //  @ts-ignore
              tickIconStyle={{ tintColor: colors.primary }}
              //  @ts-ignore
              arrowIconStyle={{ tintColor: colors.primary }}
            />
          </View>

          <View style={[styles.dataBox, {}]}>
            <LinearGradient
              start={[0.4, 0.9]}
              end={[0.9, 0.4]}
              colors={['#fb7bb3', '#fb93a3', '#f9a19a']}
              style={styles.linearGradientDataBox}
            >
              <Text style={styles.tickerLabel} variant="titleSmall">
                {selectedTickerOption?.label}
              </Text>
              <TouchableOpacity onPress={() => setRefreshing(true)} style={styles.refresher}>
                <Ionicons name="reload" size={32} color={colors.onPrimary} prop={{ ltr: false }} />
              </TouchableOpacity>
              <View style={styles.priceBox}>
                {!refreshing && price ? (
                  <>
                    <Text style={[styles.price, { color: colors.onPrimary }]}>{price}</Text>
                  </>
                ) : (
                  <View style={{}}>
                    <ActivityIndicator animating={true} color={colors.onPrimary} />
                  </View>
                )}
              </View>
              <Text style={styles.dateTime} variant="bodySmall">
                <TimeAgo timestamp={timeAgo!} />
              </Text>
              <TouchableOpacity style={[{}]} onPress={toggleTrendsPanel}>
                <FontAwesome6
                  name="angle-up"
                  style={[{ position: 'relative', bottom: -80 }, trendsPanelOpen ? { opacity: 0 } : { opacity: 1 }]}
                  size={30}
                  color={colors.primary}
                />
              </TouchableOpacity>

              <TogglePanel trendsPanelOpen={trendsPanelOpen}>
                {Object.entries(percentChanges).map(([key, value]) => (
                  <TouchableOpacity style={[{}]} onPress={toggleTrendsPanel} key={key}>
                    <View
                      style={[
                        +value! >= 0 ? { borderColor: colors.secondaryContainer } : { borderColor: colors.error },
                        {
                          borderColor: colors.primary,
                          borderWidth: 2,
                          marginHorizontal: 2,
                          minWidth: 80,
                          minHeight: 60,
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 15,
                          backgroundColor: colors.background,
                          opacity: 0.8,
                        },
                      ]}
                      key={key}
                    >
                      <Text style={[styles.trendBox, { color: colors.onPrimary }]}>{key}</Text>
                      <Text
                        style={[
                          styles.trendBox,
                          +value! >= 0 ? { color: colors.secondaryContainer } : { color: colors.error },
                        ]}
                      >
                        {value}

                        <Feather
                          name="percent"
                          size={12}
                          color={+value! >= 0 ? colors.secondaryContainer : colors.error}
                        />
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </TogglePanel>
            </LinearGradient>
          </View>
          <View style={[styles.currencyButtons, {}]}>
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
  dropdown: ViewStyle;
  dataBox: ViewStyle;
  linearGradientDataBox: ViewStyle;
  refresher: ViewStyle;
  dateTime: TextStyle;
  tickerLabel: TextStyle;
  priceBox: ViewStyle;
  price: TextStyle;
  currencyButtons: ViewStyle;
  trends: ViewStyle;
  trendBox: TextStyle;
}>({
  screen: {
    flex: 1,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('screen').width * 0.8,
  },
  dropdown: {
    width: Dimensions.get('screen').width * 0.8,
    marginBottom: 16,
  },
  dataBox: {
    width: Dimensions.get('screen').width * 0.8,
    height: Dimensions.get('screen').height * 0.25,
    borderRadius: 10,
    alignItems: 'center',
  },
  linearGradientDataBox: {
    width: Dimensions.get('screen').width * 0.8,
    borderRadius: 10,

    height: Dimensions.get('screen').height * 0.25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refresher: {
    position: 'absolute',
    top: 3,
    right: 3,
    transform: [{ scaleX: -1 }],
  },
  dateTime: {
    fontFamily: 'Roboto_400Regular',
    position: 'absolute',
    top: 15,
  },
  tickerLabel: {
    fontFamily: 'Roboto_700Bold',
    position: 'absolute',
    top: 50,
  },
  priceBox: {
    position: 'absolute',
    bottom: 75,
    flexDirection: 'row',
  },
  price: {
    fontFamily: 'Roboto_700Bold',
    lineHeight: 48,
    fontSize: 40,
  },
  currencyButtons: {
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
