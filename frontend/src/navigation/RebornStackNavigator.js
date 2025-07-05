/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Dimensions, Text, TouchableOpacity} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {useRoute, useNavigation} from '@react-navigation/native';

import HomeScreen from '../screens/home/HomeScreen';
import RebornMainScreen from '../screens/reborn/RebornMainScreen';
import IntroOutroScreen from '../screens/reborn/IntroOutroScreen';
import SurveyScreen from '../screens/reborn/SurveyScreen';
import ClinicScreen from '../screens/reborn/ClinicScreen';
import ArrangeScreen from '../screens/reborn/ArrangeScreen';
import RebirthScreen from '../screens/reborn/RebirthScreen';
import WashScreen from '../screens/reborn/WashScreen';
import DailyContentsScreen from '../screens/reborn/DailyContentsScreen';
import WalkScreen from '../screens/reborn/WalkScreen';
import EmotionDiaryScreen from '../screens/reborn/EmotionDiaryScreen';
import ImageDiaryScreen from '../screens/reborn/ImageDiaryScreen';
import WriteLetterScreen from '../screens/reborn/WriteLetterScreen';

import InfoIcon from '../assets/images/others/info.svg';

import styled from 'styled-components/native';
import colors from '../constants/colors';
import BackButton from '../components/BackButton';

const {width, height} = Dimensions.get('window');
const RebornStack = createStackNavigator();

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
        <Text style={{color: colors.brown}}>BORN 작별하기</Text>
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
    <Text style={{color: colors.brown}}>BORN 작별하기</Text>
  </TitleText>
);

const CustomBackButton = () => {
  const navigation = useNavigation();

  return (
    <BackButton
      onPress={() =>
        navigation.navigate('TabNavigator', {screen: 'HomeScreen'})
      }
    />
  );
};

const RebornStackNavigator = () => (
  <RebornStack.Navigator
    screenOptions={{
      headerShown: true,
      headerStyle: {
        elevation: 0,
      },
      headerTitleAlign: 'center',
      headerLeft: () => <CustomBackButton />,
    }}>
    <RebornStack.Screen
      name="DailyContentsScreen"
      component={DailyContentsScreen}
      options={{headerTitle: CustomHeaderTitle}}
    />
    <RebornStack.Screen
      name="WalkScreen"
      component={WalkScreen}
      options={{headerTitle: CustomHeaderTitle}}
    />

    <RebornStack.Screen
      name="IntroOutroScreen"
      component={IntroOutroScreen}
      options={{headerTitle: CustomHeaderTitle}}
    />
    <RebornStack.Screen
      name="RebornMainScreen"
      component={RebornMainScreen}
      options={{headerTitle: CustomHeaderTitle}}
    />
    <RebornStack.Screen
      name="SurveyScreen"
      component={SurveyScreen}
      options={{headerTitle: CustomHeaderTitle}}
    />
    <RebornStack.Screen
      name="ClinicScreen"
      component={ClinicScreen}
      options={{
        headerTitle: CustomHeaderTitle,
        // eslint-disable-next-line react/no-unstable-nested-components
        headerLeft: () => <BackButton />,
      }}
    />
    <RebornStack.Screen
      name="ArrangeScreen"
      component={ArrangeScreen}
      options={{headerTitle: CustomHeaderTitle2}}
    />
    <RebornStack.Screen
      name="RebirthScreen"
      component={RebirthScreen}
      options={{headerTitle: CustomHeaderTitle}}
    />
    <RebornStack.Screen
      name="WashScreen"
      component={WashScreen}
      options={{headerTitle: CustomHeaderTitle}}
    />
    <RebornStack.Screen
      name="EmotionDiaryScreen"
      component={EmotionDiaryScreen}
      options={{headerTitle: CustomHeaderTitle}}
    />
    <RebornStack.Screen
      name="ImageDiaryScreen"
      component={ImageDiaryScreen}
      options={{headerTitle: CustomHeaderTitle}}
    />
    <RebornStack.Screen
      name="WriteLetterScreen"
      component={WriteLetterScreen}
      options={{headerTitle: CustomHeaderTitle}}
    />

    <RebornStack.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{headerShown: false}}
    />
  </RebornStack.Navigator>
);

const TitleText = styled.Text`
  font-size: ${width * 0.045}px;
  font-family: 'NPSfont_extrabold';
  margin-top: ${height * 0.03}px;
`;

export default RebornStackNavigator;
