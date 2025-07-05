import React from 'react';
import {Dimensions, Text, TouchableOpacity} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {useRoute} from '@react-navigation/native';

import HomeScreen from '../screens/home/HomeScreen';
import MemoryMainScreen from '../screens/memory/MemoryMainScreen';
import RemindScreen from '../screens/memory/RemindScreen';
import RecordScreen from '../screens/memory/RecordScreen';

import InfoIcon from '../assets/images/others/info.svg';

import styled from 'styled-components/native';
import colors from '../constants/colors';
import BackButton from '../components/BackButton';

const {width, height} = Dimensions.get('window');
const MemoryStack = createStackNavigator();

/* Info 필요한 헤더 */
const CustomHeaderTitle2 = () => {
  const route = useRoute();

  const handleInfoModal = () => {
    route.params?.openInfoModal?.();
  };

  return (
    <>
      <TitleText>
        <Text style={{color: colors.yellow}}>RE</Text>
        <Text style={{color: colors.brown}}>BORN 추억하기</Text>
      </TitleText>
      <TouchableOpacity onPress={handleInfoModal}>
        <InfoIcon style={{position: 'absolute', right: -96, bottom: 0}} />
      </TouchableOpacity>
    </>
  );
};

/* Info 필요없는 헤더 */
const CustomHeaderTitle = () => (
  <TitleText>
    <Text style={{color: colors.yellow}}>RE</Text>
    <Text style={{color: colors.brown}}>BORN 추억하기</Text>
  </TitleText>
);

const MemoryStackNavigator = () => (
  <MemoryStack.Navigator
    screenOptions={{
      headerShown: true,
      headerStyle: {
        elevation: 0,
      },
      headerTitleAlign: 'center',
      headerLeft: () => <BackButton />,
    }}>
    <MemoryStack.Screen
      name="MemoryMainScreen"
      component={MemoryMainScreen}
      options={{headerTitle: CustomHeaderTitle}}
    />
    <MemoryStack.Screen
      name="RemindScreen"
      component={RemindScreen}
      options={{headerTitle: CustomHeaderTitle}}
    />
    <MemoryStack.Screen
      name="RecordScreen"
      component={RecordScreen}
      options={{headerTitle: CustomHeaderTitle2}}
    />
    <MemoryStack.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{headerShown: false}}
    />
  </MemoryStack.Navigator>
);

const TitleText = styled.Text`
  font-size: ${width * 0.045}px;
  font-family: 'NPSfont_extrabold';
  margin-top: ${height * 0.03}px;
`;

export default MemoryStackNavigator;
