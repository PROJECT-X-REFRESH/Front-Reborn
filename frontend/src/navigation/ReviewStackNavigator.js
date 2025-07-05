import React from 'react';
import {Dimensions, Text} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import MemoryAlbum from '../screens/review/memory/MemoryAlbum';
import RemindScreen from '../screens/review/memory/RemindScreen';
import RecordScreen from '../screens/review/memory/RecordScreen';
import GoodByeAlbum from '../screens/review/goodbye/GoodbyeAlbum';
import RecognizeScreen from '../screens/review/goodbye/RecognizeScreen';
import ClinicScreen from '../screens/review/goodbye/ClinicScreen';
import RevealScreen from '../screens/review/goodbye/RevealScreen';
import RememberScreen from '../screens/review/goodbye/RememberScreen';
import RebirthScreen from '../screens/review/goodbye/RebirthScreen';
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
    <Text style={{color: colors.brown}}>VIEW</Text>
  </Text>
);

const ReviewStackNavigator = () => (
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
      name="MemoryAlbum"
      component={MemoryAlbum}
      options={{headerTitle: () => <CustomHeaderTitle />}}
    />
    <Stack.Screen
      name="RemindScreen"
      component={RemindScreen}
      options={{headerTitle: () => <CustomHeaderTitle />}}
    />
    <Stack.Screen
      name="RecordScreen"
      component={RecordScreen}
      options={{headerTitle: () => <CustomHeaderTitle />}}
    />
    <Stack.Screen
      name="GoodByeAlbum"
      component={GoodByeAlbum}
      options={{headerTitle: () => <CustomHeaderTitle />}}
    />
    <Stack.Screen
      name="RecognizeScreen"
      component={RecognizeScreen}
      options={{headerTitle: () => <CustomHeaderTitle />}}
    />
    <Stack.Screen
      name="ClinicScreen"
      component={ClinicScreen}
      options={{headerTitle: () => <CustomHeaderTitle />}}
    />
    <Stack.Screen
      name="RevealScreen"
      component={RevealScreen}
      options={{headerTitle: () => <CustomHeaderTitle />}}
    />
    <Stack.Screen
      name="RememberScreen"
      component={RememberScreen}
      options={{headerTitle: () => <CustomHeaderTitle />}}
    />
    <Stack.Screen
      name="RebirthScreen"
      component={RebirthScreen}
      options={{headerTitle: () => <CustomHeaderTitle />}}
    />
  </Stack.Navigator>
);

export default ReviewStackNavigator;
