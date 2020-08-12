import React, {useEffect, useReducer, useState} from 'react';
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
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob/index';
import ImagePicker from 'react-native-image-crop-picker/index';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HeaderTab from '../HeaderTab';
import {path} from "../../../App";
const {width, height} = Dimensions.get('window');

export default function UploadImageScreen({route, navigation}) {
  const {user} = route.params;
  const [data, setData] = useReducer((data, {type, value}) => {
    switch (type) {
      case 'add':
        return [...data, value];
      case 'remove':
        return data.filter(( index) => index !== value);
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
      default:
        return dataImg;
    }
  }, []);
  const onUploadImage = async () => {
    await RNFetchBlob.fetch(
      'POST',
      `${path}/api/auth/fileUpload/images`,
      {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + user.access_token,
      },
      data,
    )
      .uploadProgress((written, total) => {
        console.log('uploaded', written / total);
      })
      .then((res) => {
        console.log('success upLoad');
        cleanupImages();
        imgs.map((i) => setImgs({type: 'remove', value: i}));
        data.map((i) => setData({type: 'remove', value: i}));
        navigation.navigate('Images');
      })
      .catch((error) => console.log(error));
  };
  const cleanupImages = () => {
    ImagePicker.clean()
      .then(() => {
        // console.log('removed tmp images from tmp directory');
        alert('Temporary images history cleared');
      })
      .catch((e) => {
        alert(e);
      });
  };
  const pickImage = () => {
    console.log(moment().utcOffset('+07:00'));
    ImagePicker.openPicker({
      multiple: true,
    })
      .then((images) => {
        images.map((i, key) => {
          setImgs({
            type: 'add',
            value: {
              uri: i.path,
              width: width / 2 - 10,
              height: width / 2 - 10,
              mime: i.mime,
            },
          });
          setData({
            type: 'add',
            value: {
              name: `${moment().utcOffset('+07:00')}`,
              filename: `${moment().utcOffset('+07:00')}.jpg`,
              data: RNFetchBlob.wrap(i.path),
            },
          });
        });
      })
      .catch((e) => alert(e));
  };
  return (
    <SafeAreaView>
      <View>
        <HeaderTab navigation={navigation} />
        <Image
          style={styles.imageAvatar}
          source={require('../../store/img/logo.png')}
        />
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: 'red',
            alignSelf: 'center',
          }}>
          Upload Image
        </Text>
        {imgs[0] != undefined ? (
          <FlatList
            data={imgs}
            style={{height: '45%', margin: 10}}
            numColumns={2}
            renderItem={({item}) => (
              <View>
                <View style={{margin: 1}}>
                  <Image source={item} />
                  <Pressable
                    style={{position: 'absolute'}}
                    onPress={() => {
                      setImgs({
                        type: 'remove',
                        value: item,
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
              NO IMAGE
            </Text>
          </View>
        )}
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
              Select Image
            </Text>
          </Pressable>
          <Pressable
            style={{backgroundColor: 'red', padding: 10, borderRadius: 15}}
            onPress={onUploadImage}>
            <Text style={{color: '#fff', fontWeight: 'bold'}}>
              Upload Image
            </Text>
          </Pressable>
        </View>
      </View>
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
