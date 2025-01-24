import { useEffect, useRef, useState } from 'react';
import {
  Image,
  StyleSheet,
  Platform,
  Dimensions,
  View,
  Animated,
  Easing,
} from 'react-native';
import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  Text,
  ActivityIndicator,
  SegmentedButtons,
} from 'react-native-paper';
import { Dropdown, DropdownRef, Option } from 'react-native-paper-dropdown';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import moment from 'moment';

import ParallaxScrollView from '@/components/ParallaxScrollView';

import { CURRENCIES } from '@/constants/Api';

import { reload } from 'expo-router/build/global-state/routing';
import { CoinsProvider, useCoins } from '@/contexts/coinsContext';

export default function HomeScreen() {
  const {
    currency,
    setCurrency,
    price,
    setPrice,
    selectedTickerOption,
    setSelectedTickerOption,
    ticker,
    setTicker,
    reloading,
    setReloading,
    tickerOptions,
    setTickerOptions,
    tickerData,
    setTickerData,
    firstTwentyCoinsData,
    setFirstTwentyCoinsData,
    fetchingData,
    rotating,
    setFetchingData,
    handleTickerSelect,
    handleCurrencyChange,
    formatCurrency,
  } = useCoins();

  const refDropdown1 = useRef<DropdownRef>(null);
  const [nightMode, setNightmode] = useState(true);
  const [timeAgo, setTimeAgo] = useState('');

  console.log('🚀  |  file: index.tsx:59  |  HomeScreen  |  ticker:', ticker);
  const rotation = useRef(new Animated.Value(0)).current;

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

  const startRotation = () => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  const stopRotation = () => {
    rotation.stopAnimation();
    rotation.setValue(0);
  };

  const refreshData = () => {
    setReloading(true);
    startRotation();
    setTimeout(() => {
      stopRotation();
      setReloading(false);
    }, 750);
  };

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['360deg', '0deg'],
  });

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#160028', dark: '#160028' }}
      headerImage={
        <Image
          source={require('@/assets/images/crypto-logo.png')}
          style={styles.logo}
        />
      }
    >
      <View style={styles.container}>
        <Dropdown
          ref={refDropdown1}
          placeholder="Select Coin"
          options={tickerOptions as unknown as Option[]}
          value={ticker}
          onSelect={handleTickerSelect}
          mode="outlined"
        />

        <View style={styles.dataBox}>
          <LinearGradient
            start={[0.4, 0.9]}
            end={[0.9, 0.4]}
            colors={['#fb7bb3', '#fb93a3', '#f9a19a']}
            style={styles.linearGradientDataBox}
          >
            <Text
              style={{ fontFamily: 'Roboto_500Medium' }}
              variant="titleSmall"
            >
              {selectedTickerOption?.label}
            </Text>
            <Animated.View
              style={{
                position: 'absolute',
                top: 3,
                right: 3,
                transform: [{ rotate: rotateInterpolate }, { scaleX: -1 }],
              }}
            >
              <Ionicons
                name="reload"
                size={32}
                onPress={refreshData}
                color={nightMode ? 'white' : 'black'}
                prop={{ ltr: false }}
              />
            </Animated.View>
            <Text
              style={{ fontFamily: 'Roboto_700Bold' }}
              variant="displaySmall"
            >
              {!reloading && price && !fetchingData ? (
                price
              ) : (
                <ActivityIndicator
                  animating={true}
                  color={nightMode ? 'white' : 'black'}
                />
              )}
            </Text>
            <Text style={styles.dateTime} variant="bodySmall">
              {timeAgo}
            </Text>
          </LinearGradient>
        </View>
        <SegmentedButtons
          value={currency}
          onValueChange={handleCurrencyChange}
          buttons={[
            {
              value: 'gbp',
              label: CURRENCIES.gbp,
            },
            {
              value: 'usd',
              label: CURRENCIES.usd,
            },
          ]}
        />
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  dataBox: {
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('screen').height * 0.2,
  },
  linearGradientContainer: {
    flex: 1,
    width: '100%',
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linearGradientDataBox: {
    flex: 1,
    width: '100%',
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: 178,
    width: Dimensions.get('screen').width,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  dropdown: {
    margin: 160,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  dateTime: {
    marginTop: 16,
  },
});
