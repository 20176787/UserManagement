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
import Icon from 'react-native-vector-icons/Entypo';
import Modal from 'react-native-modal';
const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};
export default function InformationScreen({navigation}) {
  const [user, setUser] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [userT, setUserT] = useState();
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);
  useEffect(() => {
    AsyncStorage.getItem('AuthUser').then((str) => {
      if (!str) {
        setUser(null);
      }
      try {
        setUser(JSON.parse(str));
        RNFetchBlob.fetch(
          'GET',
          'http://8d2cddcc486b.ngrok.io/api/auth/user/',
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
  }, [refreshing]);
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
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 20,
          justifyContent: 'space-between',
          backgroundColor: 'red',
        }}>
        <Pressable style={{margin: 5}} onPress={() => {}}>
          <Icon name="home" size={30} color="#fff" marginTop={5} />
        </Pressable>
        <Pressable
          style={{margin: 5}}
          onPress={() => {
            setModalVisible(true);
          }}>
          <Icon
            name="dots-three-horizontal"
            size={30}
            color="#fff"
            marginTop={5}
          />
        </Pressable>
      </View>
      <View style={{alignItems: 'center'}}>
        <Image
          style={styles.imageAvatar}
          source={require('../../store/img/logo.png')}
        />
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>{data.name}</Text>
        <Text style={{paddingTop: 5, color: '#3e3d3d'}}>
          GOOD PARTNER, GREAT SUCCESS
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.container}>
          <View>
            <Modal
              isVisible={modalVisible}
              onBackdropPress={() => setModalVisible(false)}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>
                    CÔNG TY TNHH LIÊN DOANH PHẦN MỀM AKB SOFTWARE
                  </Text>
                  <Text>
                    Địa chỉ: Số 15, ngõ 64 Lê Trọng Tấn, Thanh Xuân, Hà Nội{' '}
                  </Text>
                  <Text> PostCode: 11411</Text>
                  <Text> Email: info@akb.com.vn</Text>
                  <Text> Tel: (+84 24) 3787 7529</Text>
                  <Text> Fax: (+84 24) 3787 7533</Text>
                  <Text> TaxCode: 0102637341</Text>
                  <Pressable
                    style={{
                      ...styles.openButton,
                      backgroundColor: '#2196F3',
                      marginTop: 10,
                    }}
                    onPress={() => {
                      setModalVisible(!modalVisible);
                    }}>
                    <Text style={styles.textStyle}>BACK</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
          </View>
          <View
            style={{
              borderRadius: 15,
              backgroundColor: '#ffffff',
              margin: 30,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                margin: 20,
              }}>
              <Text>Full Name</Text>
              <Text>{data.name}</Text>
            </View>
            {drawLine()}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                margin: 20,
              }}>
              <Text>Email</Text>
              <Text>{data.email}</Text>
            </View>
            {drawLine()}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                margin: 20,
              }}>
              <Text>Phone Number</Text>
              <Text>{data.phone}</Text>
            </View>
            {drawLine()}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                margin: 20,
              }}>
              <Text>Birth</Text>
              <Text>{data.birth}</Text>
            </View>
            {drawLine()}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                margin: 20,
              }}>
              <Text>Address</Text>
              <Text>{data.address}</Text>
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
            <Text style={{color: '#fff', fontWeight: 'bold'}}>
              Update Profile
            </Text>
          </Pressable>
          <Pressable
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
                  navigation.navigate('Login');
                })
                .catch((errorMessage, statusCode) => {
                  console.log(errorMessage, statusCode);
                });
            }}
            style={{
              backgroundColor: 'red',
              alignSelf: 'center',
              borderRadius: 15,
              padding: 10,
              margin: 10,
            }}>
            <Text style={{color: '#fff', fontWeight: 'bold'}}>LOGOUT</Text>
          </Pressable>
          <Pressable
            style={{
              backgroundColor: 'red',
              alignSelf: 'center',
              borderRadius: 15,
              padding: 10,
              marginBottom: 30,
            }}
            onPress={() => navigation.navigate('ChangePassword', {user: user})}>
            <Text style={{color: '#fff', fontWeight: 'bold'}}>
              Change Password
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
});
