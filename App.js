/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import 'react-native-gesture-handler';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import DrawerContainer from './src/route/DrawerContainer';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from './src/page/LoginScreen';
import RegisterScreen from './src/page/RegisterScreen';
import ForgotPasswordScreen from './src/page/ForgotPasswordScreen';
export const AuthContext = React.createContext();
export const path = 'http://368e1b578b07.ngrok.io';
const Stack = createStackNavigator();
export default function App({navigation}) {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignOut: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignOut: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignOut: false,
      userToken: null,
    },
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem('AuthUser');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({type: 'RESTORE_TOKEN', token: userToken});
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'});
      },
      signOut: () => dispatch({type: 'SIGN_OUT'}),
      signUp: async (data) => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'});
      },
    }),
    [],
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {state.userToken == null ? (
          <Stack.Navigator headerMode={null}>
            <Stack.Screen
              name="SignIn"
              component={LoginScreen}
              options={{
                title: 'Sign in',
                animationTypeForReplace: state.isSignOut ? 'pop' : 'push',
              }}
            />
            <Stack.Screen name={'Register'} component={RegisterScreen} />
            <Stack.Screen
              name={'ForgotPassword'}
              component={ForgotPasswordScreen}
            />
          </Stack.Navigator>
        ) : (
          // User is signed in
          // <Stack.Screen name="Home" component={InformationScreen} />
          <DrawerContainer navigation={navigation} />
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
// import React, {useState} from 'react';
// import {View, Button, Platform, Pressable, Text} from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import moment from 'moment';
// export default function App() {
//   const [date, setDate] = useState(new Date(1598051730000));
//   const [mode, setMode] = useState('date');
//   const [show, setShow] = useState(false);
//   const [birth, setBirth] = useState();
//
//   const onChange = (event, selectedDate) => {
//     const currentDate = selectedDate || date;
//     setShow(Platform.OS === 'ios');
//     setBirth(moment(currentDate).format('L'));
//     console.log(moment(date).format('L'));
//   };
//
//   const showMode = (currentMode) => {
//     setShow(true);
//     setMode(currentMode);
//   };
//
//   const showDatepicker = () => {
//     showMode('date');
//   };
//
//   const showTimepicker = () => {
//     showMode('time');
//   };
//
//   return (
//     <View>
//       <Pressable style={{}} onPress={showDatepicker}>
//         <View style={{flexDirection:"row",margin:20}}>
//           <View style={{backgroundColor: '#fff',width:200,marginLeft:20}}>
//             <Text style={{alignSelf:"center",justifyContent:'center',padding:10}}>{birth}</Text>
//           </View>
//           <Icon name={'calendar'} size={50} color={'red'} />
//         </View>
//       </Pressable>
//       {show && (
//         <DateTimePicker
//           testID="dateTimePicker"
//           value={date}
//           mode={mode}
//           is24Hour={true}
//           display="default"
//           onChange={onChange}
//         />
//       )}
//     </View >
//   );
// }
