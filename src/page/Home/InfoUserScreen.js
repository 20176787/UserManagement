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
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import {path} from '../../../App';
import HeaderTab from '../../shared/HeaderTab';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ImageViewer from 'react-native-image-zoom-viewer';
import HeaderUploadImageTab from '../../shared/HeaderUploadImageTab';
import I18N from '../../store/i18n';
import moment from 'moment';
const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};
export default function InfoUserScreen({navigation, route}) {
  const {user} = route.params;
  const {language} = route.params;
  const {data} = route.params;
  moment.locale(`${language}`);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);
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
    <SafeAreaView style={{height: '100%'}}>
      <HeaderUploadImageTab
        navigation={navigation}
        NameTab={`${I18N.get('Information', language)}`}
      />
      <View style={{alignItems: 'center'}}>
        <Pressable
          onPress={() => {
            setModalVisible(true);
          }}>
          <Image
            style={styles.imageAvatar}
            source={
              data.avatar_url != null
                ? {uri: data.avatar_url}
                : require('../../store/img/logo.png')
            }
          />
        </Pressable>
        <Text style={{fontSize: 20, fontWeight: 'bold', color: 'red'}}>
          {data.name}
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['red']}
          />
        }>
        <View style={styles.container}>
          <View
            style={{
              borderRadius: 15,
              backgroundColor: '#ffffff',
              margin: 30,
            }}>
            <View
              style={{
                // flexDirection: 'row',
                // justifyContent: 'space-between',
                marginLeft: 20,
                marginRight: 20,
                marginTop: 10,
                marginBottom: 10,
              }}>
              <Text style={styles.textLabel}>{`${I18N.get(
                'Name',
                language,
              )}`}</Text>
              <Text style={styles.textDetail}>{data.name}</Text>
            </View>
            {drawLine()}
            <View style={styles.textForm}>
              <Text style={styles.textLabel}>{`${I18N.get(
                'Email',
                language,
              )}`}</Text>
              <Text style={styles.textDetail}>{data.email}</Text>
            </View>
            {drawLine()}
            <View style={styles.textForm}>
              <Text style={styles.textLabel}>{`${I18N.get(
                'PhoneNumber',
                language,
              )}`}</Text>
              <Text style={styles.textDetail}>{data.phone}</Text>
            </View>
            {drawLine()}
            <View style={styles.textForm}>
              <Text style={styles.textLabel}>{`${I18N.get(
                'Birth',
                language,
              )}`}</Text>
              <Text style={styles.textDetail}>
                {moment(data.birth).format('L')}
              </Text>
            </View>
            {drawLine()}
            <View style={styles.textForm}>
              <Text style={styles.textLabel}>{`${I18N.get(
                'Address',
                language,
              )}`}</Text>
              <Text style={styles.textDetail}>{data.address}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <Pressable
          onPress={() => setModalVisible(false)}
          style={{position: 'absolute', padding: 10}}>
          <Icon name="cancel" size={30} color="#fff" marginTop={5} />
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
  textLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  textDetail: {
    paddingRight: 50,
    paddingTop: 10,
  },
  textForm: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    marginBottom: 10,
  },
});
