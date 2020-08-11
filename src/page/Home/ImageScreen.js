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
  Alert,
} from 'react-native';
const {width, height} = Dimensions.get('window');
import AsyncStorage from '@react-native-community/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HeaderTab from '../HeaderTab';
import ImagePicker from 'react-native-image-crop-picker/index';
export default function ImageScreen({navigation}) {
  const [user, setUser] = useState();
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
      AsyncStorage.getItem('AuthUser').then((str) => {
        if (!str) {
          setUser(null);
        }
        try {
          setUser(JSON.parse(str));
          RNFetchBlob.fetch(
            'GET',
            'http://35f5c59e544b.ngrok.io/api/auth/image/',
            {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + JSON.parse(str).access_token,
            },
          )
            .then((res) => {
                console.log("res",res.data);
                console.log("asdasdasd",dataImg);
              JSON.parse(res.data).map((i) =>
                setDataImg({
                  type: 'add',
                  value: {
                    uri: i.image_path,
                    width: width / 2 - 10,
                    height: width / 2 - 10,
                    mime: i.mime,
                    id: i.id,
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
    };
    navigation.addListener('focus', () => {
      dataImg.map((i) => deleteImage(i));
      console.log("hello",dataImg)
       getData();
    });
  }, []);
  const deleteImage = ({item}) => {
    setDataImg({
      type: 'remove',
      value: item,
    });
    try {
      RNFetchBlob.fetch(
        'GET',
        `http://35f5c59e544b.ngrok.io/api/auth/deleteImage/${item.id}`,
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + user.access_token,
        },
      )
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
          Add IMAGES
        </Text>
      </Pressable>
      <View>
        <FlatList
          style={{height: '56%', margin: 10}}
          data={dataImg}
          numColumns={2}
          renderItem={({item}) => (
            <View style={{margin: 1}}>
              <Image source={item} />
              <Pressable
                style={{position: 'absolute'}}
                onPress={() => createTwoButtonAlert({item})}>
                <Icon name="cancel" size={30} color="black" marginTop={5} />
              </Pressable>
            </View>
          )}
          keyExtractor={(item, key) => key}
        />
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
