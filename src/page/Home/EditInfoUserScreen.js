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
import RNFetchBlob from 'rn-fetch-blob/index';
import HeaderTab from '../HeaderTab';
export default function EditInfoUserScreen({navigation, route}) {
  const {data} = route.params;
  const {user} = route.params;
  const [name, setName] = useState();
  const [address, setAddress] = useState();
  const [birth, setBirth] = useState();
  const [email, setEmail] = useState();
  const useData = {
    name,
    address,
    birth,
    email,
  };
  const onUpdate = async () => {
    console.log('update', useData);
    await RNFetchBlob.fetch(
      'PUT',
      `http://35f5c59e544b.ngrok.io/api/auth/update/${data.id}`,
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
              source={require('../../store/img/logo.png')}
            />
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: 'red',
                alignSelf: 'center',
                padding: 20,
              }}>
              UPDATE INFO
            </Text>
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
});
