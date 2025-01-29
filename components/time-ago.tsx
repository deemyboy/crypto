import React, { useEffect, useState } from 'react';
import { StyleSheet, TextStyle } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import moment from 'moment';

import { TimeAgoProps } from '@/types/types';

const TimeAgo: React.FC<TimeAgoProps> = ({ timestamp, interval = 60000 }) => {
  const [timeAgo, setTimeAgo] = useState(moment(timestamp).fromNow());
  const theme = useTheme();
  const { colors } = theme;

  useEffect(() => {
    setTimeAgo(moment(timestamp).fromNow());

    const timer = setInterval(() => {
      setTimeAgo(moment(timestamp).fromNow());
    }, interval);

    return () => clearInterval(timer);
  }, [timestamp, interval]);

  return (
    <Text style={[styles.dateTime, { color: colors.onPrimary }]} variant="bodySmall">
      {timeAgo}
    </Text>
  );
};

const styles = StyleSheet.create<{
  dateTime: TextStyle;
}>({
  dateTime: {
    fontFamily: 'Roboto_400Regular',
  },
});

export default TimeAgo;
