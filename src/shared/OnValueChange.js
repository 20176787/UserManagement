import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
export const setAuthUser = ({access_token, email, password}) => {
  const User = {access_token, email, password};
  console.log('User', User);
  return AsyncStorage.setItem('AuthUser', JSON.stringify(User));
};
