import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import LoginScreen from '../screens/Intro/LoginScreen';
import TutorialScreen from '../screens/Intro/TutorialScreen';
import NicknameScreen from '../screens/Intro/NicknameScreen';
import PetProfileAdd from '../screens/Intro/PetProfileAdd';

const Stack = createStackNavigator();

const IntroStackNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <Stack.Screen
      name="LoginScreen"
      component={LoginScreen}
      options={{title: '로그인'}}
    />
    <Stack.Screen
      name="TutorialScreen"
      component={TutorialScreen}
      options={{title: '튜토리얼'}}
    />
    <Stack.Screen
      name="NicknameScreen"
      component={NicknameScreen}
      options={{title: '닉네임 추가'}}
    />
    <Stack.Screen
      name="PetProfileAdd"
      component={PetProfileAdd}
      options={{title: '반려동물 프로필 추가'}}
    />
  </Stack.Navigator>
);

export default IntroStackNavigator;
