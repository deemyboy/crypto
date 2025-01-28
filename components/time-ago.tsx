import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Text } from 'react-native-paper';
import { TimeAgoProps } from '@/types/types';

const TimeAgo: React.FC<TimeAgoProps> = ({ timestamp, interval = 60000 }) => {
  const [timeAgo, setTimeAgo] = useState(moment(timestamp).fromNow());

  useEffect(() => {
    setTimeAgo(moment(timestamp).fromNow());

    const timer = setInterval(() => {
      setTimeAgo(moment(timestamp).fromNow());
    }, interval);

    return () => clearInterval(timer);
  }, [timestamp, interval]);

  return <Text>{timeAgo}</Text>;
};

export default TimeAgo;
