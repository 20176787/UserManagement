import React from 'react';
import {View, Text, Pressable} from 'react-native';
import APIKit from '../shared/APIKit';
export default function ForgotPasswordScreen({route, navigation}) {
  console.log('check sdsd', route.params.accessToken);
  return (
    <View>
      <Pressable
        onPress={() => {
          APIKit.get('/api/auth/logout', route.params.accessToken)
            .then((res) => {
              navigation.navigate('Login');
            })
            .catch((error) => console.log(error));
        }}>
        <Text>this is ForgotPasswordScreen</Text>
      </Pressable>
    </View>
  );
}
