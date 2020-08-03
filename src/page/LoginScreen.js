import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import ForgotPasswordScreen from './ForgotPasswordScreen';
const {width, height} = Dimensions.get('window');
export default function LoginScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const onSignIn = () => {
    console.log(email, password);
    fetch('http://localhost:3001/users', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((responseData) => {
        // this._onValueChange(STORAGE_KEY, responseData.id_token),
        Alert.alert(
          'Signup Success!',
          'Click the button to get a Chuck Norris quote!',
        );
      })
      .done();
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
            {/*<Text style={styles.logo}>Login</Text>*/}
            <View style={styles.inputView}>
              <TextInput
                placeholder="Your email...."
                placeholderTextColor={'#abae94'}
                style={styles.inputText}
                onChangeText={(text) => setEmail(text)}
              />
            </View>
            <View style={styles.inputView}>
              <TextInput
                placeholder="Your password...."
                placeholderTextColor={'#abae94'}
                style={styles.inputText}
                onChangeText={(text) => setPassword(text)}
              />
            </View>
            <Pressable
              style={styles.forgot}
              onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.forgot}>forgot password?</Text>
            </Pressable>
            <Pressable style={styles.loginButton} onPress={() => onSignIn()}>
              <Text style={styles.loginText}>LOGIN</Text>
            </Pressable>
            <Pressable
              style={styles.registerButton}
              onPress={() => navigation.navigate('Register')}>
              <Text style={styles.loginText}>REGISTER</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
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
    fontSize: 40,
    color: 'white',
    marginBottom: 20,
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
