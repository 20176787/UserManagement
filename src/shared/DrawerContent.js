import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
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
import {AuthContext} from '../../App';
export default function DrawerContent(props) {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const {signOut} = React.useContext(AuthContext);
  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };
  const [user, setUser] = useState();
  const [data, setData] = useState({});
  useEffect(() => {
    AsyncStorage.getItem('AuthUser').then((str) => {
      if (!str) {
        setUser(null);
      }
      try {
        setUser(JSON.parse(str));
        RNFetchBlob.fetch(
          'GET',
          'http://3e2f0304c0ff.ngrok.io/api/auth/user/',
          {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + JSON.parse(str).access_token,
          },
        )
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
  }, []);
  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props}>
        <View style={{flex: 1}}>
          <View style={{paddingLeft: 20}}>
            <View style={{flexDirection: 'row', marginTop: 15}}>
              <Avatar.Image
                source={require('../store/img/logo.png')}
                size={50}
              />
              <View style={{marginLeft: 15, flexDirection: 'column'}}>
                <Title style={styles.title}>Captain Beemo</Title>
                <Caption style={styles.caption}>@Huy1407</Caption>
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
              props.navigation.navigate('Images');
            }}
          />
          <DrawerItem
            icon={({color, size}) => (
              <Icon name={'account-outline'} color={color} size={size} />
            )}
            label={'Change Password'}
            onPress={() => {
              props.navigation.navigate('ChangePassword', {user: user});
            }}
          />
          <DrawerItem
            icon={({color, size}) => (
              <Icon name={'account-check-outline'} color={color} size={size} />
            )}
            label={'Update Profile'}
            onPress={() => {
              props.navigation.navigate('EditUser',{user:user,data:data});
            }}
          />
        </Drawer.Section>
        <Drawer.Section title={'Preferences'}>
          <TouchableRipple onPress={() => toggleTheme()}>
            <View style={styles.preference}>
              <Text>Dark Theme</Text>
              <View pointerEvents={'none'}>
                <Switch value={isDarkTheme} />
              </View>
            </View>
          </TouchableRipple>
        </Drawer.Section>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({color, size}) => (
            <Icon name="exit-to-app" color={color} size={size} />
          )}
          label="Sign Out"
          onPress={() => {
            RNFetchBlob.fetch(
              'GET',
              'http://2299aa78b423.ngrok.io/api/auth/logout/',
              {
                Authorization: user.access_token,
              },
            )
              .then(() => {
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
