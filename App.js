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
import HomeContainer from './src/route/HomeContainer';
const App: () => React$Node = () => {
  const [user, setUser] = useState();
  AsyncStorage.getItem('AuthUser')
    .then((str) => {
      if (!str) {
        setUser(null);
      }
      try {
        setUser(JSON.parse(str));
      } catch (error) {
        // AsyncStorage.removeItem('AuthUser');
        // throw error;
        console.log(error);
      }
    })
    .catch((error) => {
      // return Promise.resolve(false);
      console.log(error);
    });
  if (user == null || user == []) {
    return (
      <NavigationContainer>
        <LoginAndRegisterContainer />
      </NavigationContainer>
    );
  } else {
    return (
      <NavigationContainer>
        <HomeContainer />
      </NavigationContainer>
    );
  }
};
export default App;
