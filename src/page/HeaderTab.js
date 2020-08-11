import React, {useState} from 'react';
import {Pressable, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {DrawerActions} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Entypo';
import Modal from 'react-native-modal';
export default function HeaderTab({navigation}) {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 20,
          justifyContent: 'space-between',
          backgroundColor: 'red',
        }}>
        <Pressable
          style={{margin: 5}}
          onPress={() => {
            navigation.dispatch(DrawerActions.openDrawer());
          }}>
          <Icon name="home" size={35} color="#fff" marginTop={5} />
        </Pressable>
        <Pressable
          style={{margin: 5}}
          onPress={() => {
            setModalVisible(true);
          }}>
          <Icon
            name="dots-three-horizontal"
            size={30}
            color="#fff"
            marginTop={5}
          />
        </Pressable>
      </View>
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              CÔNG TY TNHH LIÊN DOANH PHẦN MỀM AKB SOFTWARE
            </Text>
            <Text>
              Địa chỉ: Số 15, ngõ 64 Lê Trọng Tấn, Thanh Xuân, Hà Nội{' '}
            </Text>
            <Text> PostCode: 11411</Text>
            <Text> Email: info@akb.com.vn</Text>
            <Text> Tel: (+84 24) 3787 7529</Text>
            <Text> Fax: (+84 24) 3787 7533</Text>
            <Text> TaxCode: 0102637341</Text>
            <Pressable
              style={{
                ...styles.openButton,
                backgroundColor: '#2196F3',
                marginTop: 10,
              }}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}>
              <Text style={styles.textStyle}>BACK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
