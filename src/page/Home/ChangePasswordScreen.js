import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Image,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import HeaderTab from '../../shared/HeaderTab';
import {path} from '../../../App';
import I18N from '../../store/i18n';
const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};
export default function ChangePasswordScreen({route, navigation}) {
  const [oldPassword, setOldPassword] = useState();
  const {language} = route.params;
  const [newPassword, setNewPassword] = useState();
  const [confirmNewPassword, setConfirmNewPassword] = useState();
  const data_password_change = {
    old_password: oldPassword,
    new_password: newPassword,
    new_password_confirmation: confirmNewPassword,
  };
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    wait(2000).then(() => setRefreshing(false));
  }, []);
  const {user} = route.params;
  const {data} = route.params;
  console.log(data);
  const onUpdate = async () => {
    console.log('update', data_password_change);
    setRefreshing(true);
    await RNFetchBlob.fetch(
      'POST',
      `${path}/api/auth/change_password`,
      {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + user.access_token,
      },
      JSON.stringify(data_password_change),
    )
      .then((res) => {
        setRefreshing(false);
        console.log(JSON.parse(res.data).message);
        if (JSON.parse(res.data).message === 'Password updated successfully.') {
          setOldPassword(null);
          setNewPassword(null);
          setConfirmNewPassword(null);
          navigation.navigate('Home');
        } else {
          setOldPassword(null);
          setNewPassword(null);
          setConfirmNewPassword(null);
          Alert.alert('WARRING', `${JSON.parse(res.data).message}`);
        }
      })
      .catch((error) => console.log(error));
  };
  return (
    <SafeAreaView>
      <HeaderTab
        navigation={navigation}
        NameTab={`${I18N.get('ChangePassword', language)}`}
      />
      <KeyboardAvoidingView
        style={{justifyContent: 'center'}}
        behavior="padding">
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View style={{padding: 10}}>
            <Image
              style={styles.imageAvatar}
              source={
                data.avatar_url != null
                  ? {uri: data.avatar_url}
                  : require('../../store/img/logo.png')
              }
            />
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: 'red',
                alignSelf: 'center',
                padding: 20,
              }}>
              {data.name}
            </Text>
            <View>
              <Text style={{fontWeight: 'bold'}}>{`${I18N.get(
                'OldPassword',
                language,
              )}`}</Text>
              <TextInput
                secureTextEntry
                placeholder={`${I18N.get('OldPassword', language)}`}
                defaultValue={oldPassword}
                placeholderTextColor={'#abae94'}
                onChangeText={(text) => setOldPassword(text)}
                style={styles.input}
              />
            </View>
            <View>
              <Text style={{fontWeight: 'bold'}}>{`${I18N.get(
                'NewPassword',
                language,
              )}`}</Text>
              <TextInput
                secureTextEntry
                placeholder={`${I18N.get('NewPassword', language)}`}
                defaultValue={newPassword}
                placeholderTextColor={'#abae94'}
                onChangeText={(text) => setNewPassword(text)}
                style={styles.input}
              />
            </View>
            <View>
              <Text style={{fontWeight: 'bold'}}>{`${I18N.get(
                'NewPasswordConfirm',
                language,
              )}`}</Text>
              <TextInput
                secureTextEntry
                placeholder={`${I18N.get('NewPasswordConfirm', language)}`}
                defaultValue={confirmNewPassword}
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
                {`${I18N.get('Update', language)}`}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
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
