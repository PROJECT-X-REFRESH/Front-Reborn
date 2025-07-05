import React, { useState, useRef } from 'react';
import { View, Dimensions, TouchableOpacity, Pressable } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import styled from 'styled-components/native';

import BoardScreen from '../screens/board/BoardScreen';
import ItemBoardScreen from '../screens/board/ItemBoardScreen';
import VolunteerBoardScreen from '../screens/board/VolunteerBoardScreen';
import BoardDetailScreen from '../screens/board/BoardDetailScreen';
import BoardWriteScreen from '../screens/board/BoardWriteScreen';

import BackButton from '../components/BackButton';
import HambergerIcon from '../assets/images/others/hamburger.svg';
import colors from '../constants/colors';

const Stack = createNativeStackNavigator();
const { width, height } = Dimensions.get('window');

const SideMenu = ({ isOpen, onClose, navigate, currentRoute }) => {
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

      {[{ label: '담소 나눔 게시판', screen: 'BoardScreen' },
      { label: '물건 나눔 게시판', screen: 'ItemBoardScreen' },
      { label: '봉사 나눔 게시판', screen: 'VolunteerBoardScreen' }
      ].map(({ label, screen }, index, arr) => {
        const isActive = currentRoute === screen;
        return (
          <React.Fragment key={screen}>
            <DrawerItemButton
              style={{ backgroundColor: isActive ? colors.gray100 : colors.white }}
              onPress={() => {
                navigate(screen);
                onClose();
              }}
            >
              <DrawerItemLabel style={{ color: isActive ? colors.brown : colors.gray400 }}>
                {label}
              </DrawerItemLabel>
            </DrawerItemButton>
            {screen === 'VolunteerBoardScreen' && index !== arr.length - 1 && <Divider />}
          </React.Fragment>
        );
      })}
    </Animated.View>
  );
};

const BoardStackNavigator = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentRoute, setCurrentRoute] = useState('BoardScreen');
  const navRef = useRef();
  const overlayOpacity = useSharedValue(0);

  React.useEffect(() => {
    overlayOpacity.value = withTiming(menuOpen ? 1 : 0, { duration: 200 });
  }, [menuOpen]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Stack.Navigator
          screenListeners={{
            state: (e) => {
              const route = e.data.state.routes[e.data.state.index];
              setCurrentRoute(route.name);
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
            name="BoardScreen"
            options={{
              headerLeft: () => (
                <TouchableOpacity onPress={() => setMenuOpen(true)} hitSlop={{ top: 10, bottom: 10, left: 20, right: 20 }}>
                  <HeaderIcon><HambergerIcon /></HeaderIcon>
                </TouchableOpacity>
              ),
              title: '담소 나눔 게시판',
            }}
          >
            {(props) => {
              navRef.current = props.navigation;
              return <BoardScreen {...props} />;
            }}
          </Stack.Screen>

          <Stack.Screen
            name="ItemBoardScreen"
            component={ItemBoardScreen}
            options={{
              headerLeft: () => (
                <TouchableOpacity onPress={() => setMenuOpen(true)} hitSlop={{ top: 10, bottom: 10, left: 20, right: 20 }}>
                  <HeaderIcon><HambergerIcon /></HeaderIcon>
                </TouchableOpacity>
              ),
              title: '물건 나눔 게시판',
            }}
          />

          <Stack.Screen
            name="VolunteerBoardScreen"
            component={VolunteerBoardScreen}
            options={{
              headerLeft: () => (
                <TouchableOpacity onPress={() => setMenuOpen(true)} hitSlop={{ top: 10, bottom: 10, left: 20, right: 20 }}>
                  <HeaderIcon><HambergerIcon /></HeaderIcon>
                </TouchableOpacity>
              ),
              title: '봉사 나눔 게시판',
            }}
          />

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
              headerLeft: () => <BackButton />,
              title: '글쓰기',
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
          navigate={(screen) => {
            navRef.current?.reset({
              index: 0,
              routes: [{ name: screen }],
            });
          }}
          currentRoute={currentRoute}
        />
      </View>
    </GestureHandlerRootView>
  );
};

export default BoardStackNavigator;

// Styled Components
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

const Divider = styled.View`
  height: 1px;
  background-color: ${colors.gray200};
  margin: 4px 20px;
`;

const CloseButton = styled.TouchableOpacity`
  padding: 4px 10px;
`;

const CloseText = styled.Text`
  font-size: 14px;
  color: ${colors.gray400};
  font-family: 'NPSfont_bold';
`;
