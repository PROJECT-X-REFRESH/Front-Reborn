import React, { useState, useRef } from 'react';
import { View, Dimensions, TouchableOpacity, Pressable } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import styled from 'styled-components/native';

import BoardListScreen from '../screens/board/BoardListScreen';
import BoardDetailScreen from '../screens/board/BoardDetailScreen';
import BoardWriteScreen from '../screens/board/BoardWriteScreen';

import BackButton from '../components/BackButton';
import HambergerIcon from '../assets/images/others/hamburger.svg';
import colors from '../constants/colors';

const Stack = createNativeStackNavigator();
const { width, height } = Dimensions.get('window');

const menuItems = [
  { label: '담소 나눔 게시판', category: 'POST' },
  { label: '물건 나눔 게시판', category: 'SHARE' },
  { label: '봉사 나눔 게시판', category: 'VOLUNTEER' },
];

const SideMenu = ({ isOpen, onClose, navigate, currentCategory }) => {
  const translateX = useSharedValue(isOpen ? 0 : -width * 0.75);

  React.useEffect(() => {
    translateX.value = withTiming(isOpen ? 0 : -width * 0.75, { duration: 200 });
  }, [isOpen]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={[DrawerStyle, animatedStyle]}>
      <DrawerHeader>
        <HeaderText>
          <HighlightText>RE</HighlightText>BORN 게시판
        </HeaderText>
        <CloseButton onPress={onClose}>
          <CloseText>닫기</CloseText>
        </CloseButton>
      </DrawerHeader>

      {menuItems.map(({ label, category }) => {
        const isActive = currentCategory === category;
        return (
          <DrawerItemButton
            key={category}
            style={{ backgroundColor: isActive ? colors.gray100 : colors.white }}
            onPress={() => {
              navigate('BoardListScreen', { category });
              onClose();
            }}
          >
            <DrawerItemLabel style={{ color: isActive ? colors.brown : colors.gray400 }}>
              {label}
            </DrawerItemLabel>
          </DrawerItemButton>
        );
      })}
    </Animated.View>
  );
};

const BoardStackNavigator = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('POST');
  const navRef = useRef();
  const overlayOpacity = useSharedValue(0);

  React.useEffect(() => {
    overlayOpacity.value = withTiming(menuOpen ? 1 : 0, { duration: 200 });
  }, [menuOpen]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Stack.Navigator
          screenListeners={{
            state: (e) => {
              const route = e.data.state.routes[e.data.state.index];
              const category = route.params?.category ?? 'POST';
              setCurrentCategory(category);
            },
          }}
          screenOptions={{
            headerShown: true,
            headerShadowVisible: false,
            headerStyle: { elevation: 0 },
            headerTitleStyle: {
              marginTop: Math.round(height * 0.03),
              fontSize: Math.round(width * 0.045),
              fontFamily: 'NPSfont_extrabold',
              color: colors.brown,
            },
            headerTitleAlign: 'center',
          }}
        >
          <Stack.Screen
            name="BoardListScreen"
            options={({ route }) => ({
              title:
                route?.params?.category === 'SHARE'
                  ? '물건 나눔 게시판'
                  : route?.params?.category === 'VOLUNTEER'
                    ? '봉사 나눔 게시판'
                    : '담소 나눔 게시판',
              headerLeft: () => (
                <TouchableOpacity onPress={() => setMenuOpen(true)}>
                  <HeaderIcon><HambergerIcon /></HeaderIcon>
                </TouchableOpacity>
              ),
            })}
          >
            {(props) => {
              navRef.current = props.navigation;
              return <BoardListScreen {...props} />;
            }}
          </Stack.Screen>


          <Stack.Screen
            name="BoardDetailScreen"
            component={BoardDetailScreen}
            options={({ navigation }) => ({
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <BackButton />
                </TouchableOpacity>
              ),
              title: '나눔게시판',
            })}
          />

          <Stack.Screen
            name="BoardWrite"
            component={BoardWriteScreen}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>

        {menuOpen && (
          <Pressable
            onPress={() => setMenuOpen(false)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              zIndex: 15,
            }}
          />
        )}

        <SideMenu
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
          navigate={(screen, params) => {
            navRef.current?.reset({
              index: 0,
              routes: [{ name: screen, params, key: `BoardListScreen-${params.category}`, }],
            });
          }}
          currentCategory={currentCategory}
        />
      </View>
    </GestureHandlerRootView>
  );
};

export default BoardStackNavigator;

const HeaderIcon = styled.View`
  margin-top: ${height * 0.02}px;
  margin-left: ${width * 0.08}px;
`;

const DrawerStyle = {
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
  width: width * 0.6,
  backgroundColor: colors.white,
  zIndex: 20,
};

const DrawerHeader = styled.View`
  background-color: ${colors.white};
  padding: ${height * 0.02}px ${width * 0.05}px;
  margin-top: ${height * 0.05}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const HeaderText = styled.Text`
  color: ${colors.brown};
  font-size: ${width * 0.045}px;
  font-family: 'NPSfont_extrabold';
`;

const HighlightText = styled.Text`
  color: ${colors.yellow};
  font-family: 'NPSfont_extrabold';
`;

const DrawerItemButton = styled.TouchableOpacity`
  padding: ${height * 0.015}px ${height * 0.03}px;
`;

const DrawerItemLabel = styled.Text`
  font-size: 16px;
  font-family: 'NPSfont_bold';
`;

const CloseButton = styled.TouchableOpacity`
  padding: 4px 10px;
`;

const CloseText = styled.Text`
  font-size: 14px;
  color: ${colors.gray400};
  font-family: 'NPSfont_bold';
`;
