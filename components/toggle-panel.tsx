import { TTogglePanelProps } from '@/types/types';
import { FontAwesome6 } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ViewStyle, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';

export const TogglePanel: React.FC<TTogglePanelProps> = ({ toggleTrendsPanel, trendsPanelOpen, children }) => {
  const animatedHeight = useRef<Animated.Value>(new Animated.Value(0)).current;
  const PANEL_END_HEIGHT = 70;
  const PANEL_START_HEIGHT = 0;
  const ANIMATION_DURATION = 250;

  const theme = useTheme();
  const { colors } = theme;

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: trendsPanelOpen ? PANEL_END_HEIGHT : PANEL_START_HEIGHT,
      duration: ANIMATION_DURATION,
      useNativeDriver: false,
    }).start();
  }, [trendsPanelOpen]);

  return (
    <>
      <TouchableOpacity style={[{}]} onPress={toggleTrendsPanel}>
        <FontAwesome6
          name="angle-up"
          style={[{ position: 'relative', bottom: -80 }, trendsPanelOpen ? { opacity: 0 } : { opacity: 1 }]}
          size={30}
          color={colors.onBackground}
        />
      </TouchableOpacity>
      <Animated.View style={[styles.panel, { height: animatedHeight }]}>
        <ScrollView horizontal contentContainerStyle={styles.scrollViewContent}>
          {children}
        </ScrollView>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create<{
  panel: ViewStyle;
  scrollViewContent: ViewStyle;
}>({
  panel: {
    marginTop: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    paddingVertical: 5,
  },
  scrollViewContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    paddingHorizontal: 5,
  },
});
