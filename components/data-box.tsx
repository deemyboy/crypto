import React, { useState } from 'react';
import { useTheme, Text } from 'react-native-paper';
import { TouchableOpacity, View, StyleSheet, TextStyle, ViewStyle, ActivityIndicator, Dimensions } from 'react-native';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { useCoins } from '@/contexts/coinsContext';
import { useTickerData } from '@/hooks/useTickerData';
import { LinearGradient } from 'expo-linear-gradient';
import TimeAgo from './time-ago';
import { TogglePanel } from './toggle-panel';
import { TrendBox } from './trend-box';
import { useSharedValue, withSpring } from 'react-native-reanimated';

export const DataBox: React.FC = () => {
  const theme = useTheme();
  const { colors } = theme;

  const { selectedTickerOption, refreshing, setRefreshing } = useCoins();

  const { timeAgo, percentChanges, price } = useTickerData();

  const [trendsPanelOpen, setTrendsPanelOpen] = useState(false);

  const height = useSharedValue(0);

  const toggleTrendsPanel = () => {
    setTrendsPanelOpen(!trendsPanelOpen);
    height.value = withSpring(height.value + 50);
  };

  return (
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
            <Text style={[styles.priceText, { color: colors.onPrimary }]}>{price}</Text>
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
          color={colors.onBackground}
        />
      </TouchableOpacity>
      <TogglePanel trendsPanelOpen={trendsPanelOpen}>
        {Object.entries(percentChanges).map(([key, value]) => (
          <TrendBox key={key} trendKey={key} trendValue={value} toggleTrendsPanel={toggleTrendsPanel} />
        ))}
      </TogglePanel>
    </LinearGradient>
  );
};

const styles = StyleSheet.create<{
  dataBox: ViewStyle;
  linearGradientDataBox: ViewStyle;
  refresher: ViewStyle;
  dateTime: TextStyle;
  tickerLabel: TextStyle;
  priceBox: ViewStyle;
  priceText: TextStyle;
  trends: ViewStyle;
  trendBox: TextStyle;
}>({
  dataBox: {
    width: Dimensions.get('screen').width * 0.8,
    height: Dimensions.get('screen').height * 0.25,
    borderRadius: 10,
    alignItems: 'center',
  },
  linearGradientDataBox: {
    height: Dimensions.get('screen').height * 0.25,
    width: Dimensions.get('screen').width * 0.8,
    borderRadius: 10,
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
    top: 60,
  },
  priceBox: {
    position: 'absolute',
    bottom: 70,
    flexDirection: 'row',
  },
  priceText: {
    fontFamily: 'Roboto_700Bold',
    lineHeight: 48,
    fontSize: 40,
  },
  trends: {
    alignItems: 'center',
  },
  trendBox: {
    fontFamily: 'Roboto_700Bold',
  },
});
