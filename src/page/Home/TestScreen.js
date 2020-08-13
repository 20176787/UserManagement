import React, {useState, useEffect, useCallback} from 'react';
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
  RefreshControl,
  ScrollView,
  FlatList,
} from 'react-native';
import {Fade, Placeholder, PlaceholderLine} from 'rn-placeholder';
import Modal from 'react-native-modal';
const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};
const {width, height} = Dimensions.get('window');
export default function TestScreen({navigation}) {
  // const {signIn} = React.useContext(AuthContext);
  const [phone, setPhone] = useState(null);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const onRefresh = useCallback(() => {
    wait(2000).then(() => setRefreshing(false));
  }, []);
  const payload = {
    phone: phone,
    password: password,
  };
  // const onSignIn = async () => {
  //   setRefreshing(true);
  //   await RNFetchBlob.fetch(
  //     'POST',
  //     `${path}/api/auth/login/`,
  //     {'Content-Type': 'application/json'},
  //     JSON.stringify(payload),
  //   )
  //     .then((res) => {
  //       setRefreshing(false);
  //       console.log(JSON.parse(res.text()).error);
  //       let access_token = JSON.parse(res.text()).access_token;
  //       setAuthUser({access_token, phone, password});
  //       if (access_token != undefined) {
  //         signIn({phone, password});
  //       } else {
  //         Alert.alert('phone number or password not true');
  //         setPassword(null);
  //         setPhone(null);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };
  const onSignIn = () => {
    setModalVisible(true);
    setRefreshing(true);
  };
  const checkLogin = () => {
    if (phone == null) {
      Alert.alert('WARRING', 'please enter your phone');
      setPassword(null);
    } else if (password == null || password.length < 6) {
      Alert.alert('WARRING', 'please enter your password with length > 6');
      setPassword(null);
    } else {
      onSignIn();
    }
  };
  return (
    <SafeAreaView>
      <ImageBackground
        style={styles.ImageBackground}
        source={require('../../store/img/avatar.png')}>
        <KeyboardAvoidingView
          style={{flex: 1, justifyContent: 'center'}}
          behavior="padding"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View style={styles.container}>
            <Image
              style={styles.imageAvatar}
              source={require('../../store/img/logo.png')}
            />
            {/*<Text style={styles.logo}>Login</Text>*/}
            <View style={styles.inputView}>
              <TextInput
                placeholder="Your phone...."
                defaultValue={phone}
                placeholderTextColor={'#abae94'}
                style={styles.inputText}
                onChangeText={(text) => setPhone(text)}
              />
            </View>
            <View style={styles.inputView}>
              <TextInput
                secureTextEntry
                keyboardType="default"
                placeholder="Your password...."
                defaultValue={password}
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
            <Pressable style={styles.loginButton} onPress={() => checkLogin()}>
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
