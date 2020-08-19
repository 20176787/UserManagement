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
  TextInput,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon1 from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-community/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import {path} from '../../../App';
import I18N from '../../store/i18n';
import {DrawerActions} from '@react-navigation/native';
import Modal from 'react-native-modal';
const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};
export default function ListUserScreen({route, navigation}) {
  const {user} = route.params;
  const {language} = route.params;
  const [data, setData] = useState();
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState(data || []);
  const [dataSearch, setDataSearch] = useState(data);
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
            setItems(JSON.parse(res.data));
            setDataSearch(JSON.parse(res.data));
            setRefreshing(false);
          })
          .catch((error) => console.log(error));
      } catch (error) {
        AsyncStorage.removeItem('AuthUser');
        throw error;
      }
    };
    getData();
    // navigation.addListener('focus', () => getData());
  }, []);
  const searchFilterFunction = (text) => {
    const newData = dataSearch.filter((item) => {
      const itemData = `${item.name.toUpperCase()}   
    ${item.phone.toUpperCase()} `;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setItems(newData);
    setDataSearch(data);
  };
  return (
    <SafeAreaView>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 10,
          justifyContent: 'space-between',
          backgroundColor: 'red',
        }}>
        <Pressable
          style={{margin: 5}}
          onPress={() => {
            navigation.dispatch(DrawerActions.openDrawer());
          }}>
          <Icon1 name="menu" size={35} color="#fff" marginTop={5} />
        </Pressable>
        <TextInput
          style={{
            backgroundColor: '#fff',
            borderRadius: 5,
            width: '75%',
            height: 35,
            // marginTop: 10,
            // marginBottom: 10,
            // marginLeft: 10,
            padding: 5,
            alignSelf: 'center',
          }}
          value={search}
          placeholder={`${I18N.get('Search', language)}`}
          onChangeText={(text) => {
            setSearch(text);
            searchFilterFunction(text);
          }}
          defaultValue={search}
          // onSubmitEditing={() => searchFilterFunction(search)}
        />
        <Icon name={'search'} size={30} color={'#fff'} style={{margin: 5}} />
      </View>
      {search != '' ? (
        <View>
          <Text style={{color: '#b2b2b2', alignSelf: 'center'}}>
            {items.length} {`${I18N.get('Result', language)}`} "{search}"
          </Text>
        </View>
      ) : null}
      <View style={{height: '90%'}}>
        {items.length != undefined && items.length > 0 ? (
          <FlatList
            data={items}
            keyExtractor={(item, key) => item.phone}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['red']}
              />
            }
            renderItem={({item}) => (
              <Pressable
                onPress={() =>
                  navigation.navigate('InfoUser', {
                    // user: user,
                    data: item,
                    language: language,
                  })
                }>
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
                      <View style={{flexDirection: 'row'}}>
                        <Text style={{fontWeight: 'bold'}}>
                          {`${I18N.get('Name', language)}`}:{' '}
                        </Text>
                        <Text>{item.name}</Text>
                      </View>
                      <View style={{flexDirection: 'row'}}>
                        <Text style={{fontWeight: 'bold'}}>
                          {`${I18N.get('PhoneNumber', language)}`}:{' '}
                        </Text>
                        <Text>{item.phone}</Text>
                      </View>
                      <View style={{flexDirection: 'row'}}>
                        <Text style={{fontWeight: 'bold'}}>
                          {`${I18N.get('Email', language)}`}:{' '}
                        </Text>
                        <Text>{item.email}</Text>
                      </View>
                    </View>
                  </View>
                  <Icon
                    name={'chevron-right'}
                    size={30}
                    color={'red'}
                    style={{paddingTop: 15}}
                  />
                </View>
              </Pressable>
            )}
          />
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 20,
            }}>
            <ActivityIndicator size="large" color="red" />
          </View>
        )}
      </View>
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
