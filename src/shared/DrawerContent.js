import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Pressable,
  Alert, ActivityIndicator, SafeAreaView,
} from 'react-native';
import {
  Avatar,
  Title,
  Caption,
  Drawer,
  Text,
  TouchableRipple,
} from 'react-native-paper';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RNFetchBlob from 'rn-fetch-blob/index';
import AsyncStorage from '@react-native-community/async-storage';
import {AuthContext, path} from '../../App';
import Modal from 'react-native-modal';
import I18N from '../store/i18n';
import {setLanguageAuth} from './OnValueChange';
const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};
export default function DrawerContent(props) {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const {signOut} = React.useContext(AuthContext);
  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [language, setLanguage] = useState('en');
  const onRefresh = useCallback(() => {
    wait(2000).then(() => setRefreshing(false));
  }, []);
  const [user, setUser] = useState();
  const [data, setData] = useState({});
  const createTwoButtonAlert = () =>
    Alert.alert(
      `${I18N.get('Warring', language)}`,
      `${I18N.get('AlertLogout', language)}`,
      [
        {
          text: 'Cancel',
          // onPress: () => {
          //   setSelected({type: 'reset'});
          // },
          style: 'cancel',
        },
        {text: 'OK', onPress: () => onLogout()},
      ],
      {cancelable: false},
    );
  const onLogout = () => {
    setModalVisible(true);
    setRefreshing(true);
    RNFetchBlob.fetch('GET', `${path}/api/auth/logout/`, {
      Authorization: user.access_token,
    })
      .then(() => {
        setModalVisible(false);
        setRefreshing(false);
        console.log('logout success');
        AsyncStorage.removeItem('AuthUser');
        signOut();
        // navigation.navigate('Login');
      })
      .catch((errorMessage, statusCode) => {
        console.log(errorMessage, statusCode);
      });
  };
  useEffect(() => {
    AsyncStorage.getItem('Language').then((str) => {
      if (!str) {
        setLanguage(null);
      }
      try {
        setLanguage(JSON.parse(str));
      } catch (error) {
        AsyncStorage.removeItem('AuthUser');
        throw error;
      }
    });
    AsyncStorage.getItem('AuthUser').then((str) => {
      if (!str) {
        setUser(null);
      }
      try {
        setUser(JSON.parse(str));
        RNFetchBlob.fetch('GET', `${path}/api/auth/user/`, {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + JSON.parse(str).access_token,
        })
          .then((res) => {
            console.log('hello world', res.data);
            setData(JSON.parse(res.data));
          })
          .catch((error) => console.log(error));
      } catch (error) {
        AsyncStorage.removeItem('AuthUser');
        throw error;
      }
    });
  }, [props]);
  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props}>
        <View style={{flex: 1}}>
          <View style={{paddingLeft: 20}}>
            <View style={{flexDirection: 'row', marginTop: 15}}>
              <Pressable onPress={() => props.navigation.navigate('Home')}>
                <Avatar.Image
                  source={
                    data.avatar_url != null
                      ? {uri: data.avatar_url}
                      : require('../store/img/logo.png')
                  }
                  size={50}
                />
              </Pressable>
              <View style={{marginLeft: 15, flexDirection: 'column'}}>
                <Title style={styles.title}>{data.name}</Title>
                <Caption style={styles.caption}>
                  @{data.level == '1' ? 'admin' : 'user'}
                </Caption>
              </View>
            </View>
            {/*<View>*/}
            {/*  <View>*/}
            {/*    <Paragraph style={styles.paragraph}>80</Paragraph>*/}
            {/*    <Caption style={styles.caption}>Following</Caption>*/}
            {/*  </View>*/}
            {/*  <View>*/}
            {/*    <Paragraph style={styles.paragraph}>100</Paragraph>*/}
            {/*    <Caption style={styles.caption}>Followers</Caption>*/}
            {/*  </View>*/}
            {/*</View>*/}
          </View>
        </View>
        <Drawer.Section style={{marginTop: 15}}>
          <DrawerItem
            icon={({color, size}) => (
              <Icon name={'bookmark-outline'} color={color} size={size} />
            )}
            label={`${I18N.get('Information', language)}`}
            onPress={() => {
              props.navigation.navigate('Home', {language: language});
            }}
          />
          <DrawerItem
            icon={({color, size}) => (
              <Icon name={'home-outline'} color={color} size={size} />
            )}
            label={`${I18N.get('Images', language)}`}
            onPress={() => {
              props.navigation.navigate('Images', {
                user: user,
                data: data,
                language: language,
              });
            }}
          />
          <DrawerItem
            icon={({color, size}) => (
              <Icon name={'account-outline'} color={color} size={size} />
            )}
            label={`${I18N.get('ChangePassword', language)}`}
            onPress={() => {
              props.navigation.navigate('ChangePassword', {
                user: user,
                data: data,
                language: language,
              });
            }}
          />
          {/*<DrawerItem*/}
          {/*  icon={({color, size}) => (*/}
          {/*    <Icon name={'account-check-outline'} color={color} size={size} />*/}
          {/*  )}*/}
          {/*  label={'Update Profile'}*/}
          {/*  onPress={() => {*/}
          {/*    props.navigation.navigate('EditUser', {user: user, data: data});*/}
          {/*  }}*/}
          {/*/>*/}
          {data.level == '1' ? (
            <DrawerItem
              icon={({color, size}) => (
                <Icon name={'format-list-bulleted'} color={color} size={size} />
              )}
              label={`${I18N.get('ListUser', language)}`}
              onPress={() => {
                props.navigation.navigate('ListUser', {
                  user: user,
                  language: language,
                });
              }}
            />
          ) : null}
        </Drawer.Section>
        <Drawer.Section title={`${I18N.get('Language', language)}`}>
          <TouchableRipple onPress={() => toggleTheme()}>
            <View style={styles.preference}>
              <Pressable
                style={
                  language === 'vi'
                    ? {backgroundColor: '#ff2b2b', padding: 10}
                    : {backgroundColor: '#fff', padding: 10}
                }
                onPress={() => {
                  setLanguage('vi');
                  let languageAuth = 'vi';
                  setLanguageAuth({languageAuth});
                  props.navigation.navigate('Restart', {language: language});
                }}>
                <Text>{`${I18N.get('Viet', language)}`}</Text>
              </Pressable>
              {/*<View pointerEvents={'none'}>*/}
              {/*  <Switch value={isDarkTheme} color={'red'} onPress={()=>{props.navigation.navigate('Home')}}/>*/}
              {/*</View>*/}
              <Pressable
                style={
                  language === 'en'
                    ? {backgroundColor: '#ff2b2b', padding: 10}
                    : {backgroundColor: '#fff', padding: 10}
                }
                onPress={() => {
                  setLanguage('en');
                  let languageAuth = 'en';
                  setLanguageAuth({languageAuth});
                  props.navigation.navigate('Restart', {language: language});
                }}>
                <Text>{`${I18N.get('Eng', language)}`}</Text>
              </Pressable>
            </View>
          </TouchableRipple>
        </Drawer.Section>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({color, size}) => (
            <Icon name="exit-to-app" color={color} size={size} />
          )}
          label={`${I18N.get('SignOut', language)}`}
          onPress={createTwoButtonAlert}
        />
      </Drawer.Section>
      <Modal isVisible={modalVisible}>
        <ActivityIndicator size="large" color="red" />
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  preference: {
    // flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
  },
});
