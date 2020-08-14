import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  FlatList,
  RefreshControl,
  Pressable,
} from 'react-native';
import HeaderTab from '../../shared/HeaderTab';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-community/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import {path} from '../../../App';
const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};
export default function ListUserScreen({route, navigation}) {
  const {user} = route.params;
  const [data, setData] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    wait(2000).then(() => setRefreshing(false));
  }, []);
  useEffect(() => {
    const getData = () => {
      try {
        setRefreshing(true);
        RNFetchBlob.fetch('GET', `${path}/api/auth/allUser/`, {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + user.access_token,
        })
          .then((res) => {
            console.log('hello world', res.data);
            setData(JSON.parse(res.data));
            setRefreshing(false);
          })
          .catch((error) => console.log(error));
      } catch (error) {
        AsyncStorage.removeItem('AuthUser');
        throw error;
      }
    };
    navigation.addListener('focus', () => getData());
  }, []);
  return (
    <SafeAreaView>
      <HeaderTab NameTab={'LIST USER'} navigation={navigation} />
      <FlatList
        style={{height: '100%', margin: 10}}
        data={data}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        numColumns={1}
        renderItem={({item, index}) => (
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#fff',
              padding: 10,
              margin: 10,
              justifyContent: 'space-between',
              borderRadius: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Image
                style={styles.imageAvatar}
                source={
                  item.avatar_url != null
                    ? {uri: item.avatar_url}
                    : require('../../store/img/logo.png')
                }
              />
              <View style={{paddingLeft: 20}}>
                <Text>{item.name}</Text>
                <Text>{item.phone}</Text>
                <Text>{item.email}</Text>
              </View>
            </View>
            <Icon
              name={'chevron-right'}
              size={30}
              color={'red'}
              style={{paddingTop: 15}}
            />
          </View>
        )}
        keyExtractor={(item, key) => key}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    // alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  imageAvatar: {
    width: 60,
    height: 60,
    borderRadius: 75,
    borderColor: '#ff2929',
    overflow: 'hidden',
    // marginTop: '20%',
    borderWidth: 2,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    // alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  textLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  textDetail: {
    paddingRight: 50,
    paddingTop: 10,
  },
  textForm: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    marginBottom: 10,
  },
});
