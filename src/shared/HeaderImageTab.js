import React, {useState} from 'react';
import {Pressable, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {DrawerActions} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Entypo';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
export default function HeaderImageTab({navigation, NameTab, user, data,language}) {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 10,
          justifyContent: 'space-between',
          backgroundColor: 'red',
        }}>
        <Pressable
          style={{margin: 5}}
          onPress={() => {
            navigation.dispatch(DrawerActions.openDrawer());
          }}>
          <Icon name="menu" size={35} color="#fff" marginTop={5} />
        </Pressable>
        <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 20}}>
          {NameTab ? NameTab : null}
        </Text>
        <Pressable
          style={{margin: 5}}
          onPress={() => {
            navigation.navigate('UploadImage', {user: user, data: data,language:language});
          }}>
          <Icon1 name={'add-box'} size={35} color={'#fff'}/>
        </Pressable>
      </View>
    </View>
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
