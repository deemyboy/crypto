import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ViewStyle, ScrollView, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { FontAwesome6 } from '@expo/vector-icons';

import { TogglePanelProps } from '@/types/types';

export const TogglePanel: React.FC<TogglePanelProps> = ({ toggleTrendsPanel, trendsPanelOpen, children }) => {
  const animatedHeight = useRef<Animated.Value>(new Animated.Value(0)).current;
  const PANEL_END_HEIGHT = 70;
  const PANEL_START_HEIGHT = 0;
  const ANIMATION_DURATION = 250;

  const theme = useTheme();
  const { colors } = theme;
  const animatedOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: trendsPanelOpen ? PANEL_END_HEIGHT : PANEL_START_HEIGHT,
      duration: ANIMATION_DURATION,
      useNativeDriver: false,
    }).start();

    if (trendsPanelOpen) {
      Animated.timing(animatedOpacity, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }).start();
    } else {
      setTimeout(() => {
        Animated.timing(animatedOpacity, {
          toValue: 1,
          duration: 0,
          useNativeDriver: true,
        }).start();
      }, ANIMATION_DURATION);
    }
  }, [trendsPanelOpen]);

  return (
    <View style={[styles.container, {}]}>
      <TouchableOpacity style={[styles.openIcon, {}]} onPress={toggleTrendsPanel}>
        <Animated.View style={{ opacity: animatedOpacity }}>
          <FontAwesome6 name="angle-up" size={40} color={colors.onBackground} />
        </Animated.View>
      </TouchableOpacity>
      <Animated.View style={[styles.panel, { height: animatedHeight }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
          {children}
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create<{
  container: ViewStyle;
  openIcon: ViewStyle;
  panel: ViewStyle;
  scrollViewContent: ViewStyle;
}>({
  container: {
    width: '100%',
    borderRadius: 10,
    alignItems: 'center',
  },
  openIcon: {
    position: 'relative',
    bottom: -10,
  },
  panel: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: '100%',
    flexDirection: 'row',
  },
  scrollViewContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
});
