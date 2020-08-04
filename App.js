/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import {AsyncStorage} from 'react-native';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import LoginAndRegisterContainer from './src/route/LoginAndRegisterContainer';
const App: () => React$Node = () => {
  return (
    <NavigationContainer>
      <LoginAndRegisterContainer />
    </NavigationContainer>
  );
};
export default App;
