import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Image,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import HeaderTab from '../HeaderTab';
export default function ChangePasswordScreen({route, navigation}) {
  const [oldPassword, setOldPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [confirmNewPassword, setConfirmNewPassword] = useState();
  const data_password_change = {
    old_password: oldPassword,
    new_password: newPassword,
    new_password_confirmation: confirmNewPassword,
  };
  const {user} = route.params;
  const onUpdate = async () => {
    console.log('update', data_password_change);
    await RNFetchBlob.fetch(
      'POST',
      'http://35f5c59e544b.ngrok.io/api/auth/change_password',
      {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + user.access_token,
      },
      JSON.stringify(data_password_change),
    )
      .then((res) => {
        console.log('success update');
        navigation.navigate('Home');
      })
      .catch((error) => console.log(error));
  };
  return (
    <SafeAreaView>
      <HeaderTab navigation={navigation} />
      <KeyboardAvoidingView
        style={{justifyContent: 'center', height: '80%'}}
        behavior="padding">
        <View style={{padding: 10}}>
          <Image
            style={styles.imageAvatar}
            source={require('../../store/img/logo.png')}
          />
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: 'red',
              alignSelf: 'center',
              padding: 20,
            }}>
            Change Password
          </Text>
          <View>
            <Text>Old Password</Text>
            <TextInput
              secureTextEntry
              placeholder="name"
              placeholderTextColor={'#abae94'}
              onChangeText={(text) => setOldPassword(text)}
              style={styles.input}
            />
          </View>
          <View>
            <Text>New Password</Text>
            <TextInput
              secureTextEntry
              placeholder="address"
              placeholderTextColor={'#abae94'}
              onChangeText={(text) => setNewPassword(text)}
              style={styles.input}
            />
          </View>
          <View>
            <Text>Confirm New Password</Text>
            <TextInput
              secureTextEntry
              placeholder="Date of Birth"
              placeholderTextColor={'#abae94'}
              onChangeText={(text) => setConfirmNewPassword(text)}
              style={styles.input}
            />
          </View>
          <Pressable
            style={{
              alignSelf: 'center',
              backgroundColor: 'red',
              borderRadius: 15,
              marginTop: 20,
            }}
            onPress={() => onUpdate()}>
            <Text
              style={{
                margin: 10,
                fontSize: 20,
                fontWeight: 'bold',
                color: '#fff',
              }}>
              Update
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  input: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  text: {
    fontSize: 14,
  },
  imageAvatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderColor: '#ff2929',
    overflow: 'hidden',
    // marginTop: '20%',
    borderWidth: 5,
    marginBottom: 20,
    alignSelf: 'center',
  },
});
