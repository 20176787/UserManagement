import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
export const setAuthUser = ({access_token, phone, password}) => {
  const User = {access_token, phone, password};
  console.log('User', User);
  return AsyncStorage.setItem('AuthUser', JSON.stringify(User));
};
export const setLanguageAuth = ({languageAuth}) => {
  console.log("check",languageAuth);
  return AsyncStorage.setItem('Language', JSON.stringify(languageAuth));
};
