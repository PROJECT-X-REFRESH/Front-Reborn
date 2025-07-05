import React from 'react';
import Toast from 'react-native-toast-message';
import { FcmProvider, useFcmContext } from './src/context/FcmContext';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Root from './src/navigation/RootNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { RebornProvider } from './src/context/RebornContext';
import { PetProvider } from './src/context/PetContext';
import useFCM from './src/fcm/useFCM';
import useFCMListener from './src/fcm/useFCMListener';
import { navigationRef } from './src/navigation/NavigationService';

const AppInner = () => {
  useFCM();
  useFCMListener();

  return (
    <NavigationContainer ref={navigationRef}>
      <RebornProvider>
        <PetProvider>
          <StatusBar barStyle="dark-content" />
          <Root />
        </PetProvider>
      </RebornProvider>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FcmProvider>
        <AppInner />
        <Toast />
      </FcmProvider>
    </GestureHandlerRootView>
  );
};

export default App;
