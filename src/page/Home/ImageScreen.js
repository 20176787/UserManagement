import React, {useState, useEffect, useReducer} from 'react';
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
} from 'react-native';
const {width, height} = Dimensions.get('window');
import AsyncStorage from '@react-native-community/async-storage';
import {List, ListItem} from 'react-native-elements';
import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'rn-fetch-blob';
import moment from 'moment';
export default function ImageScreen({navigation}) {
  const [user, setUser] = useState();
  const [isRun, setIsRun] = useState(false);
  const [dataImg, setDataImg] = useReducer((dataImg, {type, value}) => {
    switch (type) {
      case 'add':
        return [...dataImg, value];
      case 'remove':
        return dataImg.filter((index) => index !== value);
      default:
        return dataImg;
    }
  }, []);
  const [data, setData] = useReducer((data, {type, value}) => {
    switch (type) {
      case 'add':
        return [...data, value];
      case 'remove':
        return data.filter((_, index) => index !== value);
      default:
        return data;
    }
  }, []);
  const [imgs, setImgs] = useReducer(
    (imgs, {type, value}) => {
      switch (type) {
        case 'add':
          return [...imgs, value];
        case 'remove':
          return imgs.filter((index) => index !== value);
        default:
          return imgs;
      }
    },
    [isRun],
  );
  useEffect(() => {
    setIsRun(false);
    AsyncStorage.getItem('AuthUser').then((str) => {
      if (!str) {
        setUser(null);
      }
      try {
        dataImg.map((i) => setDataImg({type: 'remove', value: i}));
        setUser(JSON.parse(str));
        RNFetchBlob.fetch(
          'GET',
          'http://8d2cddcc486b.ngrok.io/api/auth/image/',
          {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + JSON.parse(str).access_token,
          },
        )
          .then((res) => {
            JSON.parse(res.data).map((i) =>
              setDataImg({
                type: 'add',
                value: {
                  uri: i.image_path,
                  width: width / 4,
                  height: width / 4,
                  mime: i.mime,
                },
              }),
            );
          })
          .catch((error) => console.log(error));
      } catch (error) {
        AsyncStorage.removeItem('AuthUser');
        throw error;
      }
    });
  }, [isRun]);
  const onUploadImage = async () => {
    console.log('data', data);
    await RNFetchBlob.fetch(
      'POST',
      'http://8d2cddcc486b.ngrok.io/api/auth/fileUpload',
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
        // console.log('success upLoad');
        cleanupImages();
        imgs.map((i) =>
          setImgs({
            type: 'remove',
            value: i,
          }),
        );
        setIsRun(true);
        // navigation.navigate('Home');
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
          console.log(i);
          setImgs({
            type: 'add',
            value: {
              uri: i.path,
              width: width / 4,
              height: width / 4,
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
        <View style={{alignItems: 'center'}}>
          <Image
            style={styles.imageAvatar}
            source={require('../../store/img/logo.png')}
          />
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>Huy</Text>
          <Text style={{paddingTop: 5, color: '#3e3d3d'}}>
            GOOD PARTNER, GREAT SUCCESS
          </Text>
        </View>
        <Pressable onPress={() => pickImage()}>
          <Text>Pick IMAGE</Text>
        </Pressable>
      </View>
      <View>
        <FlatList
          data={dataImg}
          numColumns={4}
          renderItem={({item}) => (
            <View>
              <Image source={item} />
            </View>
          )}
          keyExtractor={(item, key) => key}
        />
      </View>
      <Pressable onPress={onUploadImage}>
        <Text>Upload Image</Text>
      </Pressable>
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
