import React from 'react';
import {Dimensions, Text} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import ReturnChatScreen from '../screens/home/ReturnChatScreen';
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
    <Text style={{color: colors.brown}}>TURN</Text>
  </Text>
);

const ReturnChatNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
      headerStyle: {
        elevation: 0,
      },
      headerTitleAlign: 'center',
      headerLeft: () => <BackButton />,
    }}>
    <Stack.Screen
      name="ReturnChatScreen"
      component={ReturnChatScreen}
      options={{headerTitle: () => <CustomHeaderTitle />}}
    />
  </Stack.Navigator>
);

export default ReturnChatNavigator;
