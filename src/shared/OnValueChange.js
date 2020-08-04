import React from 'react';
import {AsyncStorage} from 'react-native';

const onValueChange = async (item, selectedValue) => {
  try {
    await AsyncStorage.setItem(item, selectedValue);
  } catch (error) {
    console.log('AsyncStorage error: ' + error.message);
  }
};
export default onValueChange;
