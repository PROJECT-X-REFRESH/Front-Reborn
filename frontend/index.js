/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';

AppRegistry.registerComponent(appName, () => App);

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('background 메시지 수신:', remoteMessage);
});