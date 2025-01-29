import React from 'react';
import { useTheme, Text } from 'react-native-paper';
import { TouchableOpacity, View, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { TTrendBoxProps } from '@/types/types';

export const TrendBox: React.FC<TTrendBoxProps> = ({ trendKey: key, trendValue: value, toggleTrendsPanel }) => {
  const theme = useTheme();
  const { colors } = theme;

  return (
    <TouchableOpacity style={[{}]} onPress={toggleTrendsPanel} key={key}>
      <View
        style={[
          styles.trendBox,
          +value! >= 0 ? { borderColor: colors.secondaryContainer } : { borderColor: colors.error },
          {
            borderColor: colors.onBackground,
            backgroundColor: colors.background,
            opacity: 0.8,
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
    marginHorizontal: 2,
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
