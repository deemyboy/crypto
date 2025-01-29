import React, { useState } from 'react';
import { useTheme, Text } from 'react-native-paper';
import { TouchableOpacity, View, StyleSheet, TextStyle, ViewStyle, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
      style={styles.container}
    >
      <Text style={[styles.tickerLabel, { color: colors.onPrimary }]} variant="titleSmall">
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
      <View style={styles.dateTimeBox}>
        <TimeAgo timestamp={timeAgo!} />
      </View>

      <TogglePanel trendsPanelOpen={trendsPanelOpen} toggleTrendsPanel={toggleTrendsPanel}>
        {Object.entries(percentChanges).map(([key, value]) => (
          <TrendBox
            key={key}
            trendKey={key}
            trendValue={value}
            trendsPanelOpen={trendsPanelOpen}
            toggleTrendsPanel={toggleTrendsPanel}
          />
        ))}
      </TogglePanel>
    </LinearGradient>
  );
};

const styles = StyleSheet.create<{
  container: ViewStyle;
  refresher: ViewStyle;
  dateTimeBox: ViewStyle;
  tickerLabel: TextStyle;
  priceBox: ViewStyle;
  priceText: TextStyle;
  trends: ViewStyle;
  trendBox: TextStyle;
}>({
  container: {
    height: '100%',
    width: '100%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refresher: {
    position: 'absolute',
    top: 4,
    right: 4,
    transform: [{ scaleX: -1 }],
  },
  dateTimeBox: {
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
