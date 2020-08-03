import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import InformationScreen from '../page/Home/InformationScreen';
import ImageScreen from '../page/Home/ImageScreen';
import BottomTabBarCustom from '../store/content/BottomTabBarCustom';
const Tab = createBottomTabNavigator();
export default function HomeContainer() {
  return (
    <Tab.Navigator
      headerMode={'none'}
      initialRouteName="Home"
      tabBar={(props) => <BottomTabBarCustom {...props} />}>
      <Tab.Screen name={'Information'} component={InformationScreen} />
      <Tab.Screen name={'Image'} component={ImageScreen} />
    </Tab.Navigator>
  );
}
