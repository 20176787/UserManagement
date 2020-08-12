import React, {useState, useEffect, useReducer, useCallback} from 'react';
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
  FlatList,
  Alert,
  RefreshControl,
  Modal,
} from 'react-native';
const {width, height} = Dimensions.get('window');
import AsyncStorage from '@react-native-community/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HeaderTab from '../HeaderTab';
import {path} from '../../../App';
import ImageViewer from 'react-native-image-zoom-viewer';
const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};
export default function ImageScreen({navigation}) {
  const [user, setUser] = useState();
  const images = [
    {
      // Simplest usage.
      url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460',

      // width: number
      // height: number
      // Optional, if you know the image size, you can set the optimization performance

      // You can pass props to <Image />.
      props: {
        // headers: ...
      },
    },
    {
      url: '',
      props: {
        // Or you can set source directory.
        source: require('../../assets/spb.jpg'),
      },
    },
  ];
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [isImageViewVisible, setIsImageViewVisible] = useState(false);
  const onRefresh = useCallback(() => {
    wait(1000).then(() => setRefreshing(false));
  }, []);
  const [dataImg, setDataImg] = useReducer((dataImg, {type, value}) => {
    switch (type) {
      case 'add':
        return [...dataImg, value];
      case 'remove':
        return dataImg.filter((index) => index.id !== value);
      case 'reset':
        return [];
      default:
        return dataImg;
    }
  }, []);
  const [imgs, setImgs] = useReducer((dataImg, {type, value}) => {
    switch (type) {
      case 'add':
        return [...dataImg, value];
      case 'remove':
        return dataImg.filter((index) => index.id !== value);
      case 'reset':
        return [];
      default:
        return dataImg;
    }
  }, []);
  const createTwoButtonAlert = ({item}) =>
    Alert.alert(
      'Warring ',
      'Do you want to delete this images?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => deleteImage({item})},
      ],
      {cancelable: false},
    );
  useEffect(() => {
    const getData = () => {
      console.log(dataImg);
      AsyncStorage.getItem('AuthUser').then((str) => {
        if (!str) {
          setUser(null);
        }
        try {
          setUser(JSON.parse(str));
          RNFetchBlob.fetch('GET', `${path}/api/auth/image/`, {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + JSON.parse(str).access_token,
          })
            .then((res) => {
              setDataImg({type: 'reset'});
              JSON.parse(res.data).map((i) => {
                console.log('pre insert ', dataImg);
                setDataImg({
                  type: 'add',
                  value: {
                    uri: i.image_path,
                    width: width - 20,
                    height: width / 2 - 10,
                    mime: i.mime,
                    id: i.id,
                  },
                });
                setImgs({
                  type: 'add',
                  value: {
                    props: {},
                    url: i.image_path,
                  },
                });
              });
            })
            .catch((error) => console.log(error));
        } catch (error) {
          AsyncStorage.removeItem('AuthUser');
          throw error;
        }
      });
    };
    getData();
    // navigation.addListener('focus', () => {
    //   getData();
    //   console.log('after insert ', dataImg);
    // });
    // dataImg.map((i) => setDataImg({type: 'remove', value: i}));
  }, []);
  const deleteImage = ({item}) => {
    setDataImg({
      type: 'remove',
      value: item.id,
    });
    try {
      RNFetchBlob.fetch('GET', `${path}/api/auth/deleteImage/${item.id}`, {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + user.access_token,
      })
        .then((res) => {
          console.log(res.data);
        })
        .catch((error) => console.log(error));
    } catch (error) {
      AsyncStorage.removeItem('AuthUser');
      throw error;
    }
  };
  return (
    <SafeAreaView>
      <View>
        <HeaderTab navigation={navigation} />
        <View style={{alignItems: 'center', paddingTop: 20}}>
          <Image
            style={styles.imageAvatar}
            source={require('../../store/img/logo.png')}
          />
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>Huy</Text>
          <Text style={{paddingTop: 5, color: '#3e3d3d'}}>
            GOOD PARTNER, GREAT SUCCESS
          </Text>
        </View>
      </View>

      <Pressable
        style={{
          alignItems: 'center',
          backgroundColor: 'red',
          padding: 10,
          margin: 10,
          marginTop: 30,
          borderRadius: 5,
        }}
        onPress={() => navigation.navigate('UploadImage', {user: user})}>
        <Text style={{fontWeight: 'bold', fontSize: 20, color: '#fff'}}>
          ADD IMAGES
        </Text>
      </Pressable>
      <FlatList
        style={{height: '56%', margin: 10}}
        data={dataImg}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        numColumns={1}
        renderItem={({item, index}) => {
          return (
            <View
              style={{
                margin: 1,
                backgroundColor: '#eeebeb',
                borderRadius: 10,
                marginBottom: 10,
              }}>
              <Pressable
                onPress={() => {
                  setIsImageViewVisible(true);
                  setModalVisible(true);
                  setImageIndex(index);
                }}>
                <Image source={item} style={{borderRadius: 10}} />
              </Pressable>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 10,
                }}>
                <Text>Date:12/8/2020 3:33 PM</Text>
                <Pressable
                  style={{}}
                  onPress={() => createTwoButtonAlert({item})}>
                  <Icon name="cancel" size={30} color="black" marginTop={5} />
                </Pressable>
              </View>
            </View>
          );
        }}
        keyExtractor={(item, key) => key}
      />
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <ImageViewer
          imageUrls={imgs}
          index={imageIndex}
          onSwipeDown={() => {
            setModalVisible(false);
          }}
          onMove={(data) => console.log(data)}
          enableSwipeDown={true}
        />
      </Modal>
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
});
