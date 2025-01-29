import React from 'react';
import { TouchableOpacity, View, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { useTheme, Text } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';

import { TTrendBoxProps } from '@/types/types';

export const TrendBox: React.FC<TTrendBoxProps> = ({ trendKey: key, trendValue: value, toggleTrendsPanel, isLast }) => {
  const theme = useTheme();
  const { colors } = theme;

  return (
    <TouchableOpacity style={[{}]} onPress={toggleTrendsPanel} key={key}>
      <View
        style={[
          styles.trendBox,
          {
            backgroundColor: colors.background,

            opacity: 0.8,
            marginRight: isLast ? 0 : 3,
            borderColor: +value! >= 0 ? colors.secondaryContainer : colors.error,
            // borderColor: colors.onBackground,
          },
        ]}
        key={key}
      >
        <Text style={[styles.trendText, { color: colors.onPrimary }]}>{key}</Text>
        <Text style={[styles.trendText, +value! >= 0 ? { color: colors.secondaryContainer } : { color: colors.error }]}>
          {value}
          <Feather name="percent" size={12} color={+value! >= 0 ? colors.secondaryContainer : colors.error} />
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
