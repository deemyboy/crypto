import React, { useState } from 'react';
import { TouchableOpacity, View, StyleSheet, TextStyle, ViewStyle, ActivityIndicator } from 'react-native';
import { useTheme, Text } from 'react-native-paper';
import { useSharedValue, withSpring } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import TimeAgo from './time-ago';
import { TogglePanel } from './toggle-panel';
import { TrendBox } from './trend-box';
import { useTickerData } from '@/hooks/useTickerData';
import { useCoins } from '@/contexts/coinsContext';

export const DataBox: React.FC = () => {
  const theme = useTheme();
  const { colors } = theme;

  const { selectedTickerOption, refreshing, setRefreshing } = useCoins();

  const { timeAgo, trends, price } = useTickerData();

  const [trendsPanelOpen, setTrendsPanelOpen] = useState(false);

  const height = useSharedValue(0);

  const toggleTrendsPanel = () => {
    setTrendsPanelOpen(!trendsPanelOpen);
    height.value = withSpring(height.value + 50);
  };

  const textColor = colors.onPrimary;

  return (
    <LinearGradient
      start={[0.4, 0.9]}
      end={[0.9, 0.4]}
      colors={[colors.tertiary, colors.tertiaryContainer, colors.onTertiaryContainer]}
      style={styles.container}
    >
      <Text style={[styles.tickerLabel, { color: textColor }]} variant="titleSmall">
        {selectedTickerOption?.label}
      </Text>
      <TouchableOpacity onPress={() => setRefreshing(true)} style={styles.refresher}>
        <Ionicons name="reload" size={32} color={textColor} prop={{ ltr: false }} />
      </TouchableOpacity>
      <View style={styles.priceBox}>
        {!refreshing && price ? (
          <>
            <Text style={[styles.priceText, { color: textColor }]}>{price}</Text>
          </>
        ) : (
          <View style={{}}>
            <ActivityIndicator animating={true} color={textColor} />
          </View>
        )}
      </View>
      <View style={styles.dateTimeBox}>
        <TimeAgo timestamp={timeAgo!} />
      </View>
      <View style={styles.togglePanelBox}>
        <TogglePanel trendsPanelOpen={trendsPanelOpen} toggleTrendsPanel={toggleTrendsPanel}>
          {trends.map((trend) => (
            <TrendBox
              key={trend.key}
              trendKey={trend.key}
              trendValue={trend.value}
              trendsPanelOpen={trendsPanelOpen}
              toggleTrendsPanel={toggleTrendsPanel}
              isLast={trend.isLast}
            />
          ))}
        </TogglePanel>
      </View>
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
  togglePanelBox: ViewStyle;
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
  togglePanelBox: {
    position: 'absolute',
    bottom: 5,
    paddingHorizontal: 5,
  },
});
