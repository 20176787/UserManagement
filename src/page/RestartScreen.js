import React, {useCallback, useEffect, useState} from 'react';
import {RefreshControl, ScrollView, Text} from 'react-native';
import I18N from "../store/i18n";
const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};
export default function RestartScreen({navigation,route}) {
  const [refreshing, setRefreshing] = useState(false);
  const {language} = route.params;
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
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh}  colors={["red"]}/>
      }>
      <Text style={{paddingTop:'70%',alignSelf:'center'}}>{`${I18N.get('ChangeLanguage', language)}`}</Text>
    </ScrollView>
  );
}
