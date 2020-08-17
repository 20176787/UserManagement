import React, {useCallback, useEffect, useReducer, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  KeyboardAvoidingView,
  Alert,
  Modal,
  RefreshControl,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob/index';
import ImagePicker from 'react-native-image-crop-picker/index';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HeaderTab from '../../shared/HeaderTab';
import {path} from '../../../App';
import ImageResizer from 'react-native-image-resizer';
import ImageViewer from 'react-native-image-zoom-viewer';
import HeaderUploadImageTab from '../../shared/HeaderUploadImageTab';
import I18N from "../../store/i18n";
const {width, height} = Dimensions.get('window');
const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};
export default function UploadImageScreen({route, navigation}) {
  const {user} = route.params;
  const {data} = route.params;
  const {language} = route.params;
  const [resizeImageUri, setResizedImageUri] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    wait(2000).then(() => setRefreshing(false));
  }, []);
  const [datas, setDatas] = useReducer((datas, {type, value}) => {
    switch (type) {
      case 'add':
        return [...datas, value];
      case 'remove':
        return datas.filter((index) => index !== value);
      case 'reset':
        return [];
      default:
        return datas;
    }
  }, []);
  const [dataImgs, setDataImgs] = useReducer((data, {type, value}) => {
    switch (type) {
      case 'add':
        return [...data, value];
      case 'remove':
        return data.filter((index) => index.id !== value);
      case 'reset':
        return [];
      default:
        return data;
    }
  }, []);
  const [imgs, setImgs] = useReducer((dataImg, {type, value}) => {
    switch (type) {
      case 'add':
        return [...dataImg, value];
      case 'remove':
        return dataImg.filter((index) => index !== value);
      case 'reset':
        return [];
      default:
        return dataImg;
    }
  }, []);
  useEffect(() => {
    navigation.addListener('focus', () => {
      console.log('focus');
      cleanupImages();
      setDatas({type: 'reset'});
      setImgs({type: 'reset'});
    });
  }, []);
  const onUploadImage = async () => {
    setRefreshing(true);
    imgs[0] != undefined
      ? RNFetchBlob.fetch(
          'POST',
          `${path}/api/auth/fileUpload/images`,
          {
            'Content-Type': 'multipart/form-data',
            Authorization: 'Bearer ' + user.access_token,
          },
          datas,
        )
          .uploadProgress((written, total) => {
            console.log('uploaded', written / total);
          })
          .then((res) => {
            console.log('success upLoad');
            cleanupImages();
            setRefreshing(false);
            imgs.map((i) => setImgs({type: 'remove', value: i}));
            datas.map((i) => setDatas({type: 'remove', value: i}));
            navigation.navigate('Images');
          })
          .catch((error) => console.log(error))
      : Alert.alert('WARRING', 'No image selected');
  };
  const cleanupImages = () => {
    ImagePicker.clean()
      .then(() => {})
      .catch((e) => {
        alert(e);
      });
  };
  const pickImage = async () => {
    console.log(moment().utcOffset('+07:00'));
    await ImagePicker.openPicker({
      multiple: true,
    })
      .then((images) => {
        images.map(async (i, key) => {
          ImageResizer.createResizedImage(
            i.path,
            i.width * 0.3,
            i.height * 0.3,
            'JPEG',
            40,
          )
            .then(({uri}) => {
              setImgs({
                type: 'add',
                value: {
                  uri: i.path,
                  width: width - 20,
                  height: width / 2 - 10,
                  mime: i.mime,
                },
              });
              setDatas({
                type: 'add',
                value: {
                  name: `${moment().utcOffset('+07:00')}`,
                  filename: `${moment().utcOffset('+07:00')}.jpg`,
                  data: RNFetchBlob.wrap(uri),
                },
              });
              setDataImgs({
                type: 'add',
                value: {
                  props: {},
                  url: i.path,
                  id: i.id,
                },
              });
              console.log('uri', uri);
            })
            .catch((err) => {
              console.log(err);
              return Alert.alert(
                'Unable to resize the photo',
                'Check the console for full the error message',
              );
            });
        });
      })
      .catch((e) => alert(e));
  };
  return (
    <SafeAreaView>
      <View>
        <HeaderUploadImageTab
          navigation={navigation}
          NameTab={`${I18N.get(
              'UploadImages',
              language,
          )}`}
          user={user}
        />
        <Image
          style={styles.imageAvatar}
          source={
            data.avatar_url != null
              ? {uri: data.avatar_url}
              : require('../../store/img/logo.png')
          }
        />
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: 'red',
            alignSelf: 'center',
          }}>
          {data.name}
        </Text>
        {imgs[0] != undefined ? (
          <FlatList
            data={imgs}
            style={{height: '45%', margin: 10}}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            numColumns={1}
            renderItem={({item, index}) => (
              <View>
                <View style={{margin: 1}}>
                  <Pressable
                    onPress={() => {
                      setModalVisible(true);
                      setImageIndex(index);
                    }}>
                    <Image source={item} />
                  </Pressable>
                  <Pressable
                    style={{position: 'absolute'}}
                    onPress={() => {
                      setImgs({
                        type: 'remove',
                        value: item,
                      });
                      setDataImgs({
                        type: 'remove',
                        value: item.id,
                      });
                    }}>
                    <Icon name="cancel" size={30} color="black" marginTop={5} />
                  </Pressable>
                </View>
              </View>
            )}
            keyExtractor={(item, key) => key}
          />
        ) : (
          <View style={{height: '45%', backgroundColor: '#fff', margin: 10}}>
            <Text
              style={{
                alignSelf: 'center',
                paddingTop: '50%',
                fontWeight: 'bold',
                color: '#545252',
              }}>
              {`${I18N.get(
                  'NoImage',
                  language,
              )}`}
            </Text>
          </View>
        )}
        <Text style={{alignSelf:'center', color:'red'}}>{imgs.length} {`${I18N.get(
            'Images',
            language,
        )}`}</Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 50,
          }}>
          <Pressable
            style={{backgroundColor: 'red', padding: 10, borderRadius: 15}}
            onPress={pickImage}>
            <Text style={{color: '#fff', fontWeight: 'bold'}}>
              {`${I18N.get(
                  'SelectImages',
                  language,
              )}`}
            </Text>
          </Pressable>
          <Pressable
            style={{backgroundColor: 'red', padding: 10, borderRadius: 15}}
            onPress={onUploadImage}>
            <Text style={{color: '#fff', fontWeight: 'bold'}}>
              {`${I18N.get(
                  'UploadImages',
                  language,
              )}`}
            </Text>
          </Pressable>
        </View>
      </View>
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <ImageViewer
          imageUrls={dataImgs}
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
  input: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  text: {
    fontSize: 14,
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
    alignSelf: 'center',
    marginTop: 20,
  },
});
