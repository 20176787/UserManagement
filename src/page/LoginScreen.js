import React, {useState, useEffect, useCallback, useRef} from 'react';
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
  ScrollView, ActivityIndicator,
} from 'react-native';
import {setAuthUser, setLanguageAuth} from '../shared/OnValueChange';
import RNFetchBlob from 'rn-fetch-blob';
import {AuthContext, path} from '../../App';
import Modal from 'react-native-modal';
import I18N from '../store/i18n';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/AntDesign';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuProvider,
} from 'react-native-popup-menu';
const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};
const {width, height} = Dimensions.get('window');
export default function LoginScreen({navigation}) {
  const ref_input2 = useRef();
  const {signIn} = React.useContext(AuthContext);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [language, setLanguage] = useState('en');
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);
  const onRefresh = useCallback(() => {
    wait(2000).then(() => setRefreshing(false));
  }, []);
  const payload = {
    phone: phone,
    password: password,
  };
  const onSignIn = async () => {
    setModalVisible(true);
    setRefreshing(true);
    await RNFetchBlob.fetch(
      'POST',
      `${path}/api/auth/login/`,
      {'Content-Type': 'application/json'},
      JSON.stringify(payload),
    )
      .then((res) => {
        setRefreshing(false);
        console.log(JSON.parse(res.text()).error);
        let access_token = JSON.parse(res.text()).access_token;
        setAuthUser({access_token, phone, password});
        let languageAuth = language;
        setLanguageAuth({languageAuth});
        if (access_token != undefined) {
          signIn({phone, password});
        } else {
          Alert.alert(
            `${I18N.get('Warring', language)}`,
            `${I18N.get('AlertLogin1', language)}`,
          );
          setModalVisible(false);
          setRefreshing(false);
          setPassword(null);
          // setPhone(null);
        }
      })
      .catch((err) => {
        console.log(err);
        Alert.alert('ERROR','Can not connect to serve.')
        setModalVisible(false);
      });
  };
  const checkLogin = () => {
    if (phone == null || phone == '') {
      Alert.alert(
        `${I18N.get('Warring', language)}`,
        `${I18N.get('AlertLogin2', language)}`,
      );
      setPassword(null);
    } else if (password == null || password.length < 6) {
      Alert.alert(
        `${I18N.get('Warring', language)}`,
        `${I18N.get('AlertLogin3', language)}`,
      );
      setPassword(null);
    } else {
      onSignIn();
    }
  };
  useEffect(() => {
    const getLang = () => {
      AsyncStorage.getItem('Language').then((str) => {
        if (!str) {
          console.log(null);
        }
        try {
          setLanguage(JSON.parse(str) || 'en');
        } catch (error) {
          AsyncStorage.removeItem('Language');
          throw error;
        }
      });
    };
    getLang();
  }, []);
  return (
    <SafeAreaView>
      <ImageBackground
        style={styles.ImageBackground}
        source={require('../store/img/avatar.png')}>
        <KeyboardAvoidingView
          style={{flex: 1, justifyContent: 'center'}}
          behavior="padding"
        >
          <MenuProvider>
            <Menu
              style={{
                alignItems: 'center',
                width: 100,
                borderRadius: 5,
                alignSelf: 'center',
                marginTop: 50,
                flexDirection: 'row',
              }}>
              <MenuTrigger
                text={language == 'vi' ? 'Tiếng Việt' : 'English'}
                customStyles={triggerStyles}
              />
              <Icon name={'down'} size={20} color={'#fff'} />
              <MenuOptions>
                <MenuOption
                  onSelect={() => setLanguage('vi')}
                  text="Vietnamese"
                />
                <MenuOption onSelect={() => setLanguage('en')}>
                  <Text style={{color: 'red'}}>English</Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
            <View style={styles.container}>
              <Image
                style={styles.imageAvatar}
                source={require('../store/img/logo.png')}
              />
              {/*<Text style={styles.logo}>Login</Text>*/}
              <View style={styles.inputView}>
                <TextInput
                  placeholder={`${I18N.get('PhoneNumber', language)}`}
                  defaultValue={phone}
                  placeholderTextColor={'#abae94'}
                  autoFocus={true}
                  style={styles.inputText}
                  onChangeText={(text) => setPhone(text)}
                  onSubmitEditing={() => ref_input2.current.focus()}
                />
              </View>
              <View style={styles.inputView}>
                <TextInput
                  ref={ref_input2}
                  secureTextEntry
                  keyboardType="default"
                  placeholder={`${I18N.get('Password', language)}`}
                  defaultValue={password}
                  placeholderTextColor={'#abae94'}
                  style={styles.inputText}
                  onChangeText={(text) => setPassword(text)}
                />
              </View>
              {/*<Pressable*/}
              {/*  style={styles.forgot}*/}
              {/*  onPress={() => navigation.navigate('ForgotPassword')}>*/}
              {/*  <Text style={styles.forgot}>forgot password?</Text>*/}
              {/*</Pressable>*/}
              <Pressable
                style={styles.loginButton}
                onPress={() => checkLogin()}>
                <Text style={styles.loginText}>{`${I18N.get(
                  'Login',
                  language,
                )}`}</Text>
              </Pressable>
              <Pressable
                style={styles.registerButton}
                onPress={() =>
                  navigation.navigate('Register', {language: language})
                }>
                <Text style={styles.loginText}>{`${I18N.get(
                  'Register',
                  language,
                )}`}</Text>
              </Pressable>
            </View>
          </MenuProvider>
        </KeyboardAvoidingView>
      </ImageBackground>
      <Modal isVisible={modalVisible}>
        <ActivityIndicator size="large" color="red" />
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
const triggerStyles = {
  triggerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  triggerWrapper: {
    padding: 5,
    // backgroundColor: 'blue',
  },
  triggerTouchable: {
    underlayColor: 'darkblue',
    activeOpacity: 70,
  },
};
