import React from 'react';
import {Dimensions} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import MypageScreen from '../screens/mypage/MypageScreen';
import PetProfileAdd from '../screens/mypage/PetProfileAdd';
import PetProfileList from '../screens/mypage/PetProfileList';
import PetProfileManage from '../screens/mypage/PetProfileManage';
import colors from '../constants/colors';
import BackButton from '../components/BackButton';

const {width, height} = Dimensions.get('window');
const Stack = createStackNavigator();

const MypageStackNavigator = () => (
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
      name="MypageScreen"
      component={MypageScreen}
      options={{title: '마이페이지', headerLeft: () => null}}
    />
    <Stack.Screen
      name="PetProfileAdd"
      component={PetProfileAdd}
      options={{title: '반려동물 프로필 관리'}}
    />
    <Stack.Screen
      name="PetProfileList"
      component={PetProfileList}
      options={{title: '반려동물 프로필 관리'}}
    />
    <Stack.Screen
      name="PetProfileManage"
      component={PetProfileManage}
      options={{title: '반려동물 프로필 관리'}}
    />
  </Stack.Navigator>
);

export default MypageStackNavigator;
