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
import HeaderTab from '../../shared/HeaderTab';
import {path} from '../../../App';
import ImageViewer from 'react-native-image-zoom-viewer';
import HeaderImageTab from '../../shared/HeaderImageTab';
import moment from 'moment';
const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};
export default function ImageScreen({route, navigation}) {
  const {user} = route.params;
  const {data} = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    wait(2000).then(() => setRefreshing(false));
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
  const [selected, setSelected] = useReducer((selected, {type, value}) => {
    switch (type) {
      case 'add':
        return [...selected, value];
      case 'remove':
        return selected.filter((index) => index.id !== value);
      case 'reset':
        return [];
      default:
        return selected;
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
      try {
        setRefreshing(true);
        RNFetchBlob.fetch('GET', `${path}/api/auth/image/`, {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + user.access_token,
        })
          .then((res) => {
            setDataImg({type: 'reset'});
            setImgs({type: 'reset'});
            JSON.parse(res.data).map((i) => {
              console.log(i);
              setDataImg({
                type: 'add',
                value: {
                  uri: i.image_path,
                  width: width - 20,
                  height: width / 2 - 10,
                  mime: i.mime,
                  id: i.id,
                  time: i.created_at,
                },
              });
              setImgs({
                type: 'add',
                value: {
                  props: {},
                  url: i.image_path,
                  id: i.id,
                  time: i.created_at,
                },
              });
            });
            setRefreshing(false);
          })
          .catch((error) => console.log(error));
      } catch (error) {
        AsyncStorage.removeItem('AuthUser');
        throw error;
      }
    };
    navigation.addListener('focus', () => {
      getData();
      console.log('after insert ', dataImg);
    });
    // dataImg.map((i) => setDataImg({type: 'remove', value: i}));
  }, []);
  const deleteImage = async ({item}) => {
    setDataImg({
      type: 'remove',
      value: item.id,
    });
    setImgs({
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
  const multiDeleteImage = async () => {
    console.log(selected);
    selected.map((i) => {
      setDataImg({
        type: 'remove',
        value: i.id,
      });
      setImgs({
        type: 'remove',
        value: i.id,
      });
    });

    try {
      RNFetchBlob.fetch(
        'POST',
        `${path}/api/auth/multiDeleteImages`,
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + user.access_token,
        },
        JSON.stringify(selected),
      )
        .then((res) => {
          console.log(res.data);
          setSelected({type: 'reset'});
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
        <HeaderImageTab
          navigation={navigation}
          NameTab={'IMAGES'}
          user={user}
          data={data}
        />
        <View style={{alignItems: 'center', paddingTop: 20}}>
          <Image
            style={styles.imageAvatar}
            source={
              {uri: data.avatar_url} || require('../../store/img/logo.png')
            }
          />
          <Text style={{fontSize: 20, fontWeight: 'bold', color: 'red'}}>
            {data.name}
          </Text>
        </View>
      </View>
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
                  selected.map((i) => {
                    if (i.id == item.id) {
                      setSelected({type: 'remove', value: item.id});
                    }
                  });
                  if (selected[0] == undefined) {
                    setModalVisible(true);
                    setImageIndex(index);
                  }
                }}
                onLongPress={() => {
                  let check = 1;
                  selected.map((i) => {
                    if (i.id == item.id) {
                      check = 0;
                    }
                  });
                  if (check == 1) {
                    setSelected({type: 'add', value: {id: item.id}});
                  }
                  console.log('fsdfsdfsdfsd');
                }}>
                {selected.map((i) => {
                  if (i.id == item.id) {
                    console.log(item.id);
                    return (
                      <Icon
                        style={{position: 'absolute'}}
                        name="check-box"
                        size={30}
                        color="green"
                        marginTop={5}
                      />
                    );
                  }
                })}
                <Image source={item} style={{borderRadius: 10, zIndex: -1}} />
              </Pressable>
              <View
                style={{
                  alignSelf: 'center',
                  justifyContent: 'space-between',
                  padding: 10,
                }}>
                <Text style={{color: '#646363', fontSize: 14, paddingTop: 5}}>
                  {moment(item.time).format('LLLL')}
                </Text>
                {/*<Pressable*/}
                {/*  style={{}}*/}
                {/*  onPress={() => createTwoButtonAlert({item})}>*/}
                {/*  <Icon name="cancel" size={30} color="black" marginTop={5} />*/}
                {/*</Pressable>*/}
              </View>
            </View>
          );
        }}
        keyExtractor={(item, key) => key}
      />
      {selected[0] != undefined ? (
        <Pressable
          onPress={multiDeleteImage}
          style={{
            backgroundColor: 'red',
            alignSelf: 'center',
            borderRadius: 15,
            padding: 10,
          }}>
          <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 20}}>
            DELETE
          </Text>
        </Pressable>
      ) : null}
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <Pressable
          onPress={() => setModalVisible(false)}
          style={{position: 'absolute'}}>
          <Icon name="cancel" size={30} color="#fff" marginTop={5} />
        </Pressable>
        <ImageViewer
          imageUrls={imgs}
          index={imageIndex}
          onSwipeDown={() => {
            setModalVisible(false);
          }}
          onMove={(data) => console.log(data)}
          enableSwipeDown={true}
          style={{zIndex: -1}}
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
