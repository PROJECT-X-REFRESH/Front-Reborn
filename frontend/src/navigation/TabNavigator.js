import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Dimensions} from 'react-native';
import HomeScreen from '../screens/home/HomeScreen';
import ReviewHome from '../screens/review/ReviewHome';
import BoardStackNavigator from './BoardStackNavigator';
import MypageStackNavigator from './MypageStackNavigator';

import HomeIcon from '../assets/images/others/home_gray.svg';
import HomeIconYellow from '../assets/images/others/home_yellow.svg';
import BoardIcon from '../assets/images/others/board_gray.svg';
import BoardIconYellow from '../assets/images/others/board_yellow.svg';
import ReviewIcon from '../assets/images/others/review_gray.svg';
import ReviewIconYellow from '../assets/images/others/review_yellow.svg';
import MyPageIcon from '../assets/images/others/mypage_gray.svg';
import MyPageIconYellow from '../assets/images/others/mypage_yellow.svg';

const {height} = Dimensions.get('window');
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route, navigation}) => {
        // 현재 네비게이션 상태 가져오기
        const state = navigation.getState();

        // TalkScreen이 현재 중첩된 스택/드로어 안에 포함되어 있는지 확인
        const isTalkScreen = state.routes.some(r =>
          r.state?.routes?.some(child => child.name === 'TalkScreen'),
        );

        return {
          tabBarIcon: ({focused, size}) => {
            let IconComponent;

            if (route.name === 'Home') {
              IconComponent = focused ? HomeIconYellow : HomeIcon;
            } else if (route.name === 'Review') {
              IconComponent = focused ? ReviewIconYellow : ReviewIcon;
            } else if (route.name === 'Board') {
              IconComponent = focused ? BoardIconYellow : BoardIcon;
            } else if (route.name === 'Mypage') {
              IconComponent = focused ? MyPageIconYellow : MyPageIcon;
            }

            return <IconComponent width={size} height={size} />;
          },
          tabBarActiveTintColor: '#F4C27F',
          tabBarInactiveTintColor: 'gray',
          tabBarShowLabel: false,
          headerShown: false,
          tabBarStyle: isTalkScreen
            ? {display: 'none'}
            : {
                height: height * 0.08,
                paddingTop: height * 0.01,
              },
        };
      }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Review" component={ReviewHome} />
      <Tab.Screen name="Board" component={BoardStackNavigator} />
      <Tab.Screen name="Mypage" component={MypageStackNavigator} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
