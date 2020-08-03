/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Pressable,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import 'react-native-gesture-handler';
import LoginScreen from './src/page/LoginScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginAndRegisterContainer from './src/route/LoginAndRegisterContainer';
import HomeContainer from './src/route/HomeContainer';
const App: () => React$Node = () => {
  const Stack = createStackNavigator();
  return (
     <NavigationContainer>
       <LoginAndRegisterContainer/>
       {/*<HomeContainer/>*/}
     </NavigationContainer>
  );
};
export default App;
