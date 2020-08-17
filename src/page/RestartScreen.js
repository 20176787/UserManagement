import React, {useCallback, useEffect, useState} from 'react';
import {RefreshControl, ScrollView, Text} from 'react-native';
const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};
export default function RestartScreen({navigation}) {
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => {
      setRefreshing(false);
      navigation.navigate('Home');
    });
  }, []);
  useEffect(() => {
    navigation.addListener('focus', () => {
      onRefresh();
    });
  }, []);
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <Text>Change Language Process....</Text>
    </ScrollView>
  );
}
