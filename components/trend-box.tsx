import React from 'react';
import { TouchableOpacity, View, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { useTheme, Text } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';

import { TrendBoxProps } from '@/types/types';

export const TrendBox: React.FC<TrendBoxProps> = ({ trendKey: key, trendValue: value, toggleTrendsPanel, isLast }) => {
  const theme = useTheme();
  const { colors } = theme;
  const valueBasedColor = +value! >= 0 ? (+value! === 0 ? colors.onPrimary : colors.secondary) : colors.error;

  return (
    <TouchableOpacity style={[{}]} onPress={toggleTrendsPanel} key={key}>
      <View
        style={[
          styles.trendBox,
          {
            backgroundColor: colors.background,

            opacity: 0.8,
            marginRight: isLast ? 0 : 3,
            borderColor: valueBasedColor,
          },
        ]}
        key={key}
      >
        <Text style={[styles.trendText, { color: colors.onPrimary }]}>{key}</Text>
        <Text style={[styles.trendText, { color: valueBasedColor }]}>
          {value}
          <Feather name="percent" size={12} color={valueBasedColor} />
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create<{
  trendBox: ViewStyle;
  trendText: TextStyle;
}>({
  trendBox: {
    borderWidth: 2,
    minWidth: 80,
    minHeight: 60,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  trendText: {
    fontFamily: 'Roboto_700Bold',
  },
});
