import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../page/LoginScreen';
import RegisterScreen from '../page/RegisterScreen';
import ForgotPasswordScreen from '../page/ForgotPasswordScreen';
import HomeContainer from './HomeContainer';
import EditInfoUserScreen from '../page/Home/EditInfoUserScreen';
import ListUsersScreen from '../page/Home/ListUsersScreen';
import ChangePasswordScreen from "../page/Home/ChangePasswordScreen";
const Stack = createStackNavigator();
export default function LoginAndRegisterContainer() {
  return (
    <Stack.Navigator headerMode={'none'}>
      <Stack.Screen name={'Login'} component={LoginScreen} />
      <Stack.Screen name={'Register'} component={RegisterScreen} />
      <Stack.Screen name={'ForgotPassword'} component={ForgotPasswordScreen} />
      <Stack.Screen name={'Home'} component={HomeContainer} />
      <Stack.Screen name={'EditUser'} component={EditInfoUserScreen} />
      <Stack.Screen name={'List'} component={ListUsersScreen} />
      <Stack.Screen name={'ChangePassword'} component={ChangePasswordScreen} />
    </Stack.Navigator>
  );
}
