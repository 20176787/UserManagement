import * as React from 'react';
import {useState, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  KeyboardAvoidingView,
  SafeAreaView,
  Image,
} from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
const {width, height} = Dimensions.get('window');
export default function PhoneSignInScreen({navigation}) {
  const [confirm, setConfirm] = useState(null);
  const [code, setCode] = useState('');
  const [check, setCheck] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    code,
    setCode,
  });
  useEffect(() => {
    if (phoneNumber != '') {
      setCheck(true);
    } else {
      setCheck(false);
    }
  }, [phoneNumber]);
  async function confirmCode() {
    try {
      await confirm.confirm(code);
    } catch (error) {
      console.log('invalid code.');
      alert('invalid code.');
    }
  }
  return (
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
          <Text style={styles.inputText}>insert your code</Text>
          <CodeField
            value={code}
            onChangeText={setCode}
            cellCount={6}
            rootStyle={styles.codeFiledRoot}
            keyboardType="number-pad"
            renderCell={({index, symbol, isFocused}) => (
              <Text
                key={index}
                style={[styles.cell, isFocused && styles.focusCell]}
                onLayout={getCellOnLayoutHandler(index)}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            )}
          />
          <TouchableOpacity
            style={[
              styles.registerButton,
              check && styles.registerButtonComplete,
            ]}
            onPress={()=>navigation.goBack()}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
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
    color: '#fff',
    fontSize:20,
    fontWeight: "bold",
  },
  forgot: {
    color: 'white',
    fontSize: 11,
  },
  registerButtonComplete: {
    width: '80%',
    backgroundColor: '#fb5b5a',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginTop: 20,
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
  root: {padding: 20, minHeight: 400},
  title: {textAlign: 'center', fontSize: 30},
  codeFiledRoot: {marginTop: 20},
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 2,
    borderColor: '#fff',
    textAlign: 'center',
  },
  focusCell: {
    borderColor: '#000',
  },
  ImageBackground: {
    width: width,
    height: height * 1.1,
    zIndex: -1,
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
