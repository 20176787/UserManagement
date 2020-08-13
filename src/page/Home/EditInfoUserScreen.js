import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  StyleSheet,
  Image,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker/index';
import RNFetchBlob from 'rn-fetch-blob/index';
import HeaderTab from '../../shared/HeaderTab';
import {path} from '../../../App';
import Modal from 'react-native-modal';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import HeaderUploadImageTab from "../../shared/HeaderUploadImageTab";
export default function EditInfoUserScreen({navigation, route}) {
  const {width, height} = Dimensions.get('window');
  const {data} = route.params;
  const {user} = route.params;
  const [name, setName] = useState();
  const [address, setAddress] = useState();
  const [birth, setBirth] = useState();
  const [email, setEmail] = useState();
  const [avtUri, setAvtUri] = useState();
  const [avatar_url, setAvatar_url] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const useData = {
    name,
    address,
    birth,
    email,
  };
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
        navigation.navigate('Home');
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
  return (
    <SafeAreaView>
      <HeaderUploadImageTab navigation={navigation} NameTab={'UPDATE PROFILE'} user={user} />
      <ScrollView>
        <KeyboardAvoidingView
          style={{justifyContent: 'center', height: '100%'}}
          behavior="padding">
          <View style={{padding: 10}}>
            <Image
              style={styles.imageAvatar}
              source={
                avtUri || {uri: data.avatar_url} ||
                require('../../store/img/logo.png')
              }
            />
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
                Change Avatar
              </Text>
            </Pressable>
            <View>
              <Text style={styles.textLabel}>Name</Text>
              <TextInput
                placeholder="name"
                placeholderTextColor={'#abae94'}
                defaultValue={data.name}
                onChangeText={(text) => setName(text)}
                style={styles.input}
              />
            </View>
            <View>
              <Text style={styles.textLabel}>PhoneNumber</Text>
              <Text
                style={{paddingTop: 10, paddingBottom: 10, color: '#abae94'}}>
                {data.phone}
              </Text>
            </View>
            <View>
              <Text style={styles.textLabel}>Address</Text>
              <TextInput
                placeholder="address"
                placeholderTextColor={'#abae94'}
                defaultValue={data.address}
                onChangeText={(text) => setAddress(text)}
                style={styles.input}
              />
            </View>
            <View>
              <Text style={styles.textLabel}>Date of Birth</Text>
              <View>
                <Pressable style={{}} onPress={showDatepicker}>
                  <View style={{flexDirection: 'row',justifyContent:'space-between',paddingTop:10,paddingBottom:10}}>
                    <View
                      style={{
                        backgroundColor: '#fff',
                        width: width * 0.8,
                        borderRadius: 5,
                      }}>
                      <Text style={styles.input}>{birth||data.birth}</Text>
                    </View>
                    <Icon name={'calendar'} size={50} color={'red'} />
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
              <Text style={styles.textLabel}>Email</Text>
              <TextInput
                placeholder="email"
                placeholderTextColor={'#abae94'}
                defaultValue={data.email}
                onChangeText={(text) => setEmail(text)}
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
                UPDATE
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
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
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  input: {
    marginTop: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingLeft:2
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
