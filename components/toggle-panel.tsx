import { TTogglePanelProps } from '@/types/types';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ViewStyle, TextStyle, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';

export const TogglePanel: React.FC<TTogglePanelProps> = ({ trendsPanelOpen, children }) => {
  const animatedHeight = useRef<Animated.Value>(new Animated.Value(0)).current;

  const { colors } = useTheme();
  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: trendsPanelOpen ? 70 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [trendsPanelOpen]);
  return (
    <>
      <Animated.View
        style={[
          styles.panel,
          {
            position: 'absolute',
            bottom: 0,
            height: animatedHeight,
            width: '100%',
            backgroundColor: 'transparent',
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            paddingVertical: 5,
          },
        ]}
      >
        <ScrollView horizontal contentContainerStyle={styles.scrollViewContent}>
          {children}
        </ScrollView>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create<{
  container: ViewStyle;
  button: ViewStyle;
  buttonText: TextStyle;
  panel: ViewStyle;
  panelText: TextStyle;
  scrollViewContent: ViewStyle;
}>({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'orange',
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  panel: {
    marginTop: 20,
    backgroundColor: 'lightgray',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  panelText: {
    padding: 20,
    textAlign: 'center',
  },
  scrollViewContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    paddingHorizontal: 5,
  },
});
