import React from 'react';
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
} from 'react-native';
export default function InformationScreen() {
  const userData = {
    username: 'huy1407',
    email: 'huy14071999@gmail.com',
    birth: '14/07/1999',
    phoneNumber: '0366717837',
    fullName: 'Le Ngoc Huy',
    address: 'Ha Noi',
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
      <ScrollView>
        <View style={styles.container}>
          <Pressable style={{padding: 10}}>
            <Text style={{fontSize: 20, color: 'red', fontWeight: 'bold'}}>
              Edit
            </Text>
          </Pressable>
          <View style={{alignItems: 'center'}}>
            <Image
              style={styles.imageAvatar}
              source={require('../../store/img/logo.png')}
            />
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>{userData.username}</Text>
            <Text style={{paddingTop: 5, color: '#3e3d3d'}}>
              GOOD PARTNER, GREAT SUCCESS
            </Text>
          </View>
          <View
            style={{borderRadius: 15, backgroundColor: '#ffffff', margin: 30}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                margin: 20,
              }}>
              <Text>Full Name</Text>
              <Text>{userData.fullName}</Text>
            </View>
            {drawLine()}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                margin: 20,
              }}>
              <Text>Email</Text>
              <Text>{userData.email}</Text>
            </View>
            {drawLine()}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                margin: 20,
              }}>
              <Text>Phone Number</Text>
              <Text>{userData.phoneNumber}</Text>
            </View>
            {drawLine()}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                margin: 20,
              }}>
              <Text>Birth</Text>
              <Text>{userData.birth}</Text>
            </View>
            {drawLine()}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                margin: 20,
              }}>
              <Text>Address</Text>
              <Text>{userData.address}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
