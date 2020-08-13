import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  ImageBackground,
  Pressable,
  Dimensions,
  StyleSheet,
  KeyboardAvoidingView,
  TextInput,
  Alert,
  ScrollView,
  RefreshControl,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import {setAuthUser} from '../shared/OnValueChange';
import {AuthContext, path} from '../../App';
import Modal from 'react-native-modal';
const {width, height} = Dimensions.get('window');
const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};
export default function RegisterScreen({navigation}) {
  const {signUp} = React.useContext(AuthContext);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    wait(2000).then(() => setRefreshing(false));
  }, []);
  const useData = {
    name: username,
    phone: phone,
    password: password,
    password_confirmation: confirmPassword,
  };
  const onSignUp = async () => {
    setModalVisible(true);
    setRefreshing(true);
    await RNFetchBlob.fetch(
      'POST',
      `${path}/api/auth/signup/`,
      {'Content-Type': 'application/json'},
      JSON.stringify(useData),
    )
      .then((res) => {
        let access_token = JSON.parse(res.text()).access_token;
        setAuthUser({access_token, phone, password});
        if (access_token != undefined) {
          signUp({phone, password});
        } else {
          setModalVisible(false);
          setRefreshing(false);
          console.log(JSON.parse(res.text()).error);
          Alert.alert('WARRING', `${JSON.parse(res.text()).error.phone[0]}`);
          setPassword(null);
          setConfirmPassword(null);
        }
      })
      .catch((error) => console.log(error));
  };
  const checkRegister = () => {
    if (username == null) {
      Alert.alert('WARRING', 'please enter username');
      setPassword(null);
      setConfirmPassword(null);
    } else if (phone == null) {
      Alert.alert('WARRING', 'please enter your phone');
      setPassword(null);
      setConfirmPassword(null);
    } else if (password == null || password.length < 6) {
      Alert.alert('WARRING', 'please enter your password with length > 6');
      setPassword(null);
      setConfirmPassword(null);
    } else if (password != confirmPassword) {
      Alert.alert('WARRING', 'your confirm password is not correct');
      setPassword(null);
      setConfirmPassword(null);
    } else {
      onSignUp();
    }
  };
  return (
    <SafeAreaView>
      <ImageBackground
        style={styles.ImageBackground}
        source={require('../store/img/avatar.png')}>
        <KeyboardAvoidingView
          style={{flex: 1, justifyContent: 'center'}}
          behavior="padding">
          <View style={styles.container}>
            <Image
              style={styles.imageAvatar}
              source={require('../store/img/logo.png')}
            />
            {/*<Text style={styles.logo}>Register</Text>*/}
            <View style={styles.inputView}>
              <TextInput
                placeholder="Username...."
                placeholderTextColor={'#abae94'}
                style={styles.inputText}
                onChangeText={(text) => setUsername(text)}
              />
            </View>
            <View style={styles.inputView}>
              <TextInput
                placeholder="phone...."
                placeholderTextColor={'#abae94'}
                style={styles.inputText}
                onChangeText={(text) => setPhone(text)}
              />
            </View>
            <View style={styles.inputView}>
              <TextInput
                secureTextEntry
                placeholder="password...."
                defaultValue={password}
                placeholderTextColor={'#abae94'}
                style={styles.inputText}
                onChangeText={(text) => setPassword(text)}
              />
            </View>
            <View style={styles.inputView}>
              <TextInput
                secureTextEntry
                placeholder="Confirm password...."
                defaultValue={confirmPassword}
                placeholderTextColor={'#abae94'}
                style={styles.inputText}
                onChangeText={(text) => setConfirmPassword(text)}
              />
            </View>
            <Pressable
              style={styles.loginButton}
              onPress={() => checkRegister()}>
              <Text style={styles.loginText}>REGISTER</Text>
            </Pressable>
            <Pressable
              style={styles.forgot}
              onPress={() => navigation.goBack()}>
              <Text style={styles.forgot}>
                already has an account?
                {
                  <Text style={{fontWeight: 'bold', fontSize: 14}}>
                    {' '}
                    Login{' '}
                  </Text>
                }
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </Modal>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  ImageBackground: {
    width: width,
    height: height * 1.1,
    zIndex: -1,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 50,
    color: 'white',
    marginBottom: 40,
  },
  inputView: {
    width: '80%',
    backgroundColor: '#feffcb',
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 20,
  },
  inputText: {
    height: 50,
    color: '#4b4412',
    fontSize: 15,
  },
  forgot: {
    color: 'white',
    fontSize: 11,
    paddingTop: 20,
  },
  loginButton: {
    width: '80%',
    backgroundColor: '#fb5b5a',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  registerButton: {
    width: '80%',
    backgroundColor: '#abae94',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  loginWithPhoneNumberButton: {
    width: '80%',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  loginText: {
    color: 'white',
  },
  imageAvatar: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderColor: '#ebeaea',
    overflow: 'hidden',
    // marginBottom: 20,
  },
});
