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
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker/index';
import RNFetchBlob from 'rn-fetch-blob/index';
import HeaderTab from '../HeaderTab';
import {path} from '../../../App';
import Modal from 'react-native-modal';
import moment from 'moment';
export default function EditInfoUserScreen({navigation, route}) {
  const {data} = route.params;
  const {user} = route.params;
  const [name, setName] = useState();
  const [address, setAddress] = useState();
  const [birth, setBirth] = useState();
  const [email, setEmail] = useState();
  const [avtUri, setAvtUri] = useState();
  const [avatar_url, setAvatar_url] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const useData = {
    name,
    address,
    birth,
    email,
    // avatar_url,
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
    await onUploadImage();
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
  return (
    <SafeAreaView>
      <HeaderTab navigation={navigation} />
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
              <Text>Name</Text>
              <TextInput
                placeholder="name"
                placeholderTextColor={'#abae94'}
                defaultValue={data.name}
                onChangeText={(text) => setName(text)}
                style={styles.input}
              />
            </View>
            <View>
              <Text>PhoneNumber</Text>
              <Text
                style={{paddingTop: 10, paddingBottom: 10, color: '#abae94'}}>
                {data.phone}
              </Text>
            </View>
            <View>
              <Text>Address</Text>
              <TextInput
                placeholder="address"
                placeholderTextColor={'#abae94'}
                defaultValue={data.address}
                onChangeText={(text) => setAddress(text)}
                style={styles.input}
              />
            </View>
            <View>
              <Text>Date of Birth</Text>
              <TextInput
                placeholder="Date of Birth"
                placeholderTextColor={'#abae94'}
                defaultValue={data.birth}
                onChangeText={(text) => setBirth(text)}
                style={styles.input}
              />
            </View>
            <View>
              <Text>Email</Text>
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
                Update
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
});
