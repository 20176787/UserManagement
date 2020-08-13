import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ImageBackground,
  Image,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  RefreshControl,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import {path} from '../../../App';
import HeaderTab from '../../shared/HeaderTab';
const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};
export default function InformationScreen({navigation}) {
  const [user, setUser] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);
  useEffect(() => {
    const getData = () => {
      setRefreshing(true);
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
              setRefreshing(false);
            })
            .catch((error) => console.log(error));
        } catch (error) {
          AsyncStorage.removeItem('AuthUser');
          throw error;
        }
      });
    };
    navigation.addListener('focus', () => getData());
  }, []);
  const drawLine = () => {
    return (
      <View
        style={{
          borderBottomColor: 'rgba(0,0,0,0.73)',
          borderBottomWidth: 1.5,
          marginLeft: 20,
          marginRight: 20,
        }}
      />
    );
  };
  return (
    <SafeAreaView style={{height: '100%'}}>
      <HeaderTab navigation={navigation} NameTab={'INFORMATION'} />
      <View style={{alignItems: 'center'}}>
        <Pressable onPress={() => {}}>
          <Image
            style={styles.imageAvatar}
            source={{uri: data.avatar_url} || null}
          />
        </Pressable>
        <Text style={{fontSize: 20, fontWeight: 'bold', color: 'red'}}>
          {data.name}
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.container}>
          <View
            style={{
              borderRadius: 15,
              backgroundColor: '#ffffff',
              margin: 30,
            }}>
            <View
              style={{
                // flexDirection: 'row',
                // justifyContent: 'space-between',
                marginLeft: 20,
                marginRight: 20,
                marginTop: 10,
                marginBottom: 10,
              }}>
              <Text style={styles.textLabel}>Full Name</Text>
              <Text style={styles.textDetail}>{data.name}</Text>
            </View>
            {drawLine()}
            <View style={styles.textForm}>
              <Text style={styles.textLabel}>Email</Text>
              <Text style={styles.textDetail}>{data.email}</Text>
            </View>
            {drawLine()}
            <View style={styles.textForm}>
              <Text style={styles.textLabel}>Phone Number</Text>
              <Text style={styles.textDetail}>{data.phone}</Text>
            </View>
            {drawLine()}
            <View style={styles.textForm}>
              <Text style={styles.textLabel}>Birth</Text>
              <Text style={styles.textDetail}>{data.birth}</Text>
            </View>
            {drawLine()}
            <View style={styles.textForm}>
              <Text style={styles.textLabel}>Address</Text>
              <Text style={styles.textDetail}>{data.address}</Text>
            </View>
          </View>
          <Pressable
            onPress={() =>
              navigation.navigate('EditUser', {
                data: data,
                user: user,
              })
            }
            style={{
              backgroundColor: 'red',
              alignSelf: 'center',
              borderRadius: 15,
              padding: 10,
            }}>
            <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 20}}>
              UPDATE PROFILE
            </Text>
          </Pressable>
        </View>
      </ScrollView>
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
    width: 150,
    height: 150,
    borderRadius: 75,
    borderColor: '#ff2929',
    overflow: 'hidden',
    // marginTop: '20%',
    borderWidth: 5,
    marginBottom: 20,
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
