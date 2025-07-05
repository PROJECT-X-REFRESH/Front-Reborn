import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import HomeScreen from '../screens/home/HomeScreen';
import TabNavigator from './TabNavigator';

import IntroStackNavigator from './IntroStackNavigator';
import ReturnPostNavigator from './ReturnPostNavigator';
import ReturnChatNavigator from './ReturnChatNavigator';
import ReviewStackNavigator from './ReviewStackNavigator';
import BoardStackNavigator from './BoardStackNavigator';
import MypageStackNavigator from './MypageStackNavigator';
import RebornStackNavigator from './RebornStackNavigator';
import MemoryStackNavigator from './MemoryStackNavigator';

const Nav = createNativeStackNavigator();

const RootNavigator = () => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <Nav.Navigator
      initialRouteName="IntroStackNavigator"
      screenOptions={{ headerShown: false }}>
      <Nav.Screen name="HomeScreen" component={HomeScreen} />
      <Nav.Screen name="TabNavigator" component={TabNavigator} />
      <Nav.Screen
        name="IntroStackNavigator"
        component={IntroStackNavigator}
        initialParams={{ screen: 'LoginScreen' }}
      />
      <Nav.Screen
        name="ReturnPostNavigator"
        component={ReturnPostNavigator}
        initialParams={{ screen: 'ReturnPostScreen' }}
      />
      <Nav.Screen
        name="ReturnChatNavigator"
        component={ReturnChatNavigator}
        initialParams={{ screen: 'ReturnChatScreen' }}
      />
      <Nav.Screen
        name="ReviewStackNavigator"
        component={ReviewStackNavigator}
      />
      <Nav.Screen
        name="BoardStackNavigator"
        component={BoardStackNavigator}
      />
      <Nav.Screen
        name="MypageStackNavigator"
        component={MypageStackNavigator}
      />
      <Nav.Screen
        name="RebornStackNavigator"
        component={RebornStackNavigator}
      />
      <Nav.Screen
        name="MemoryStackNavigator"
        component={MemoryStackNavigator}
      />
    </Nav.Navigator>
  </GestureHandlerRootView>
);
export default RootNavigator;
