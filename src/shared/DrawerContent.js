import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import {
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
} from 'react-native-paper';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RNFetchBlob from 'rn-fetch-blob/index';
import AsyncStorage from '@react-native-community/async-storage';
import {AuthContext, path} from '../../App';
import Modal from 'react-native-modal';
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
  const onRefresh = useCallback(() => {
    wait(2000).then(() => setRefreshing(false));
  }, []);
  const [user, setUser] = useState();
  const [isFocus, setIsFocus] = useState(false);
  const [data, setData] = useState({});
  useEffect(() => {
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
              <Avatar.Image
                source={
                  data.avatar_url != null
                    ? {uri: data.avatar_url}
                    : require('../store/img/logo.png')
                }
                size={50}
              />
              <View style={{marginLeft: 15, flexDirection: 'column'}}>
                <Title style={styles.title}>{data.name}</Title>
                <Caption style={styles.caption}>@user</Caption>
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
            label={'Information'}
            onPress={() => {
              props.navigation.navigate('Home');
            }}
          />
          <DrawerItem
            icon={({color, size}) => (
              <Icon name={'home-outline'} color={color} size={size} />
            )}
            label={'Images'}
            onPress={() => {
              props.navigation.navigate('Images', {user: user, data: data});
            }}
          />
          <DrawerItem
            icon={({color, size}) => (
              <Icon name={'account-outline'} color={color} size={size} />
            )}
            label={'Change Password'}
            onPress={() => {
              props.navigation.navigate('ChangePassword', {
                user: user,
                data: data,
              });
            }}
          />
          <DrawerItem
            icon={({color, size}) => (
              <Icon name={'account-check-outline'} color={color} size={size} />
            )}
            label={'Update Profile'}
            onPress={() => {
              props.navigation.navigate('EditUser', {user: user, data: data});
            }}
          />
          {data.level == '1' ? (
            <DrawerItem
              icon={({color, size}) => (
                <Icon name={'format-list-bulleted'} color={color} size={size} />
              )}
              label={'List User'}
              onPress={() => {
                props.navigation.navigate('ListUser', {user: user});
              }}
            />
          ) : null}
        </Drawer.Section>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({color, size}) => (
            <Icon name="exit-to-app" color={color} size={size} />
          )}
          label="Sign Out"
          onPress={() => {
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
          }}
        />
      </Drawer.Section>
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
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
    flexDirection: 'row',
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
