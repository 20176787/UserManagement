import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../page/LoginScreen';
import RegisterScreen from '../page/RegisterScreen';
import ForgotPasswordScreen from '../page/ForgotPasswordScreen';
import HomeContainer from './HomeContainer';
const Stack = createStackNavigator();
export default function LoginAndRegisterContainer() {
  return (
    <Stack.Navigator headerMode={'none'}>
      <Stack.Screen name={'Login'} component={LoginScreen} />
      <Stack.Screen name={'Register'} component={RegisterScreen} />
      <Stack.Screen name={'ForgotPassword'} component={ForgotPasswordScreen} />
      <Stack.Screen name={'Home'} component={HomeContainer} />
    </Stack.Navigator>
  );
}
