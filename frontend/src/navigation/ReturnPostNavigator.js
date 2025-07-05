import React from 'react';
import {Dimensions, Text} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';

import ReturnPostScreen from '../screens/home/ReturnPostScreen';

import colors from '../constants/colors';
import BackButton from '../components/BackButton';

const {width, height} = Dimensions.get('window');
const Stack = createStackNavigator();

const CustomHeaderTitle = () => (
  <Text
    style={{
      fontSize: width * 0.045,
      fontFamily: 'NPSfont_extrabold',
      marginTop: height * 0.03,
    }}>
    <Text style={{color: colors.yellow}}>RE</Text>
    <Text style={{color: colors.brown}}>TURN 포스트</Text>
  </Text>
);

const ReturnPostNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
      headerStyle: {
        elevation: 0,
      },
      headerTitleStyle: {
        marginTop: height * 0.03,
        fontSize: width * 0.045,
        fontFamily: 'NPSfont_extrabold',
        color: colors.brown,
      },
      headerTitleAlign: 'center',
      headerLeft: () => <BackButton />,
    }}>
    <Stack.Screen
      name="ReturnPostScreen"
      component={ReturnPostScreen}
      options={{headerTitle: () => <CustomHeaderTitle />}}
    />
  </Stack.Navigator>
);
export default ReturnPostNavigator;
