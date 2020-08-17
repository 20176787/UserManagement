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
  Modal as Model1,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import {path} from '../../../App';
import HeaderTab from '../../shared/HeaderTab';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import ImageViewer from 'react-native-image-zoom-viewer';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import ImagePicker from 'react-native-image-crop-picker/index';
import ViewAvatar from '../../shared/ViewAvatar';
import I18N from '../../store/i18n';
const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};
export default function InformationScreen({navigation, route}) {
  const [user, setUser] = useState();
  const [language, setLanguage] = useState();
  const [data, setData] = useState({});
  const {width, height} = Dimensions.get('window');
  const [name, setName] = useState();
  const [address, setAddress] = useState();
  const [birth, setBirth] = useState();
  const [email, setEmail] = useState();
  const [avtUri, setAvtUri] = useState();
  const [avatar_url, setAvatar_url] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleAvatar, setModalVisibleAvatar] = useState(false);
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const useData = {
    name,
    address,
    birth,
    email,
  };
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);
  useEffect(() => {
    const getLang = () => {
      AsyncStorage.getItem('Language').then((str) => {
        if (!str) {
          setLanguage(null);
        }
        try {
          moment.locale('vi');
          setLanguage(JSON.parse(str));
        } catch (error) {
          AsyncStorage.removeItem('AuthUser');
          throw error;
        }
      });
    };
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
      getLang();
      getData();
  }, []);
  const onUploadImage = async () => {
    await RNFetchBlob.fetch(
      'POST',
      `${path}/api/auth/fileUpload/avatar`,
      {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + user.access_token,
      },

      [
        {
          name: `${moment().utcOffset('+07:00')}`,
          filename: `${moment().utcOffset('+07:00')}.jpg`,
          data: RNFetchBlob.wrap(avtUri.uri || null),
        },
      ],
    )
      .uploadProgress((written, total) => {
        console.log('uploaded', written / total);
      })
      .then((res) => {
        console.log('success upLoad');
        setAvatar_url(path + '/file/' + baseName(avtUri.uri || null));
        cleanupImages();
      })
      .catch((error) => console.log(error));
  };
  const cleanupImages = () => {
    ImagePicker.clean()
      .then(() => {
        // console.log('removed tmp images from tmp directory');
      })
      .catch((e) => {
        alert(e);
      });
  };
  function baseName(str) {
    var base = new String(str).substring(str.lastIndexOf('/') + 1);
    return base;
  }
  const onUpdate = async () => {
    console.log('update', useData);
    setRefreshing(true);
    if (avtUri != null) {
      await onUploadImage();
    }
    await RNFetchBlob.fetch(
      'PUT',
      `${path}/api/auth/update/${data.id}`,
      {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + user.access_token,
      },
      JSON.stringify(useData),
    )
      .then((res) => {
        console.log('success update');
        setRefreshing(false);
      })
      .catch((error) => console.log(error));
  };
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setBirth(moment(currentDate).format('L'));
    console.log(moment(date).format('L'));
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };
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
    <SafeAreaView>
      <HeaderTab
        navigation={navigation}
        NameTab={`${I18N.get('Information', language)}`}
      />
      <KeyboardAvoidingView
        style={{justifyContent: 'center'}}
        behavior="padding">
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View style={{padding: 10}}>
            <Pressable
              onPress={() => {
                setModalVisibleAvatar(true);
              }}>
              <Image
                style={styles.imageAvatar}
                source={
                  avtUri != null
                    ? avtUri
                    : data.avatar_url != null
                    ? {uri: data.avatar_url}
                    : require('../../store/img/logo.png')
                }
              />
            </Pressable>
            <Pressable
              onPress={() => {
                setModalVisible(true);
              }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: 'red',
                  alignSelf: 'center',
                  padding: 20,
                }}>
                {`${I18N.get('ChangeAvatar', language)}`}
              </Text>
            </Pressable>
            <View>
              <Text style={styles.textLabel}>{`${I18N.get('Name', language)}`}</Text>
              <TextInput
                placeholder="name"
                placeholderTextColor={'#abae94'}
                defaultValue={data.name}
                onChangeText={(text) => setName(text)}
                style={styles.input}
              />
            </View>
            <View>
              <Text style={styles.textLabel}>{`${I18N.get('PhoneNumber', language)}`}</Text>
              <Text
                style={{paddingTop: 10, paddingBottom: 10, color: '#abae94'}}>
                {data.phone}
              </Text>
            </View>
            <View>
              <Text style={styles.textLabel}>{`${I18N.get('Email', language)}`}</Text>
              <TextInput
                placeholder="email"
                placeholderTextColor={'#abae94'}
                defaultValue={data.email}
                onChangeText={(text) => setEmail(text)}
                style={styles.input}
              />
            </View>
            <View>
              <Text style={styles.textLabel}>{`${I18N.get('Birth', language)}`}</Text>
              <View>
                <Pressable style={{}} onPress={showDatepicker}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingTop: 10,
                      paddingBottom: 10,
                    }}>
                    <View
                      style={{
                        backgroundColor: '#fff',
                        width: width * 0.95,
                        borderRadius: 5,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={
                          (styles.input,
                          {paddingTop: 15, paddingBottom: 15, paddingLeft: 2})
                        }>
                        {birth || data.birth}
                      </Text>
                      <Icon
                        name={'calendar'}
                        size={30}
                        color={'red'}
                        style={{padding: 10}}
                      />
                    </View>
                  </View>
                </Pressable>
                {show && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                  />
                )}
              </View>
            </View>
            <View>
              <Text style={styles.textLabel}>{`${I18N.get('Address', language)}`}</Text>
              <TextInput
                placeholder="address"
                placeholderTextColor={'#abae94'}
                defaultValue={data.address}
                onChangeText={(text) => setAddress(text)}
                style={styles.input}
              />
            </View>
            <Pressable
              style={{
                alignSelf: 'center',
                backgroundColor: 'red',
                borderRadius: 15,
                marginTop: 20,
              }}
              onPress={() => onUpdate()}>
              <Text
                style={{
                  margin: 10,
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: '#fff',
                }}>
                {`${I18N.get('Update', language)}`}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
        <Modal
          isVisible={modalVisible}
          onBackdropPress={() => setModalVisible(false)}>
          <View style={styles.modalView}>
            <Pressable
              style={{backgroundColor: '#868585', borderRadius: 10, margin: 10}}
              onPress={() =>
                ImagePicker.openPicker({
                  width: 300,
                  height: 400,
                  cropping: true,
                }).then((image) => {
                  setModalVisible(false);
                  setAvtUri({
                    uri: image.path,
                    width: image.width,
                    height: image.height,
                    mime: image.mime,
                  });
                  console.log(image);
                })
              }>
              <Text style={{fontSize: 15, fontWeight: 'bold', padding: 10}}>
                Select image from gallery
              </Text>
            </Pressable>
            <Pressable
              style={{backgroundColor: '#868585', borderRadius: 10, margin: 10}}
              onPress={() => {
                ImagePicker.openCamera({
                  width: 300,
                  height: 400,
                  cropping: true,
                }).then((image) => {
                  setModalVisible(false);
                  setAvtUri({
                    uri: image.path,
                    width: image.width,
                    height: image.height,
                    mime: image.mime,
                  });
                  console.log(image);
                });
              }}>
              <Text style={{fontSize: 15, fontWeight: 'bold', padding: 10}}>
                Select image from camera
              </Text>
            </Pressable>
          </View>
        </Modal>
      </KeyboardAvoidingView>
      <Model1
        visible={modalVisibleAvatar}
        transparent={true}
        onRequestClose={() => setModalVisibleAvatar(false)}>
        <Pressable
          onPress={() => setModalVisibleAvatar(false)}
          style={{position: 'absolute', padding: 10}}>
          <Icon1 name="cancel" size={30} color="#fff" marginTop={5} />
        </Pressable>
        <ImageViewer
          imageUrls={[
            {
              props: {
                source:
                  data.avatar_url == null
                    ? require('../../store/img/logo.png')
                    : null,
              },
              url: data.avatar_url,
            },
          ]}
          index={0}
          onSwipeDown={() => {
            setModalVisibleAvatar(false);
          }}
          onMove={(data) => console.log(data)}
          enableSwipeDown={true}
          style={{zIndex: -1}}
        />
      </Model1>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  input: {
    marginTop: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingLeft: 2,
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
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
