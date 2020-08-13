import React, {useEffect, useState} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import InformationScreen from '../page/Home/InformationScreen';
import ImageScreen from '../page/Home/ImageScreen';
import {useWindowDimensions} from 'react-native';
import DrawerContent from '../shared/DrawerContent';
import EditInfoUserScreen from '../page/Home/EditInfoUserScreen';
import ListUsersScreen from '../page/Home/ListUsersScreen';
import ChangePasswordScreen from '../page/Home/ChangePasswordScreen';
import UploadImageScreen from '../page/Home/UploadImageScreen';
import ForgotPasswordScreen from '../page/ForgotPasswordScreen';
const Drawer = createDrawerNavigator();
export default function DrawerContainer({navigation}) {
  const dimensions = useWindowDimensions();
  return (
    <Drawer.Navigator
      drawerType={dimensions.width > 900 ? 'permanent' : 'front'}
      drawerStyle={{
        backgroundColor: '#fff',
        width: 250,
      }}
      drawerContentOptions={{
        activeTintColor: '#e9000d',
        // itemStyle: { marginVertical: 30 },
      }}
      drawerContent={(props) => <DrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={InformationScreen} />
      <Drawer.Screen name="Images" component={ImageScreen} />
      <Drawer.Screen name={'EditUser'} component={EditInfoUserScreen} />
      <Drawer.Screen name={'List'} component={ListUsersScreen} />
      <Drawer.Screen name={'ChangePassword'} component={ChangePasswordScreen} />
      <Drawer.Screen name={'UploadImage'} component={UploadImageScreen} />
      <Drawer.Screen name={'ForgotPassword'} component={ForgotPasswordScreen} />
    </Drawer.Navigator>
  );
}
