import {useEffect} from 'react';
import {useFcmContext} from '../context/FcmContext';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';

const useFCM = () => {
  const {setFcmToken} = useFcmContext();

  useEffect(() => {
    const requestUserPermission = async () => {
      try {
        // Android 13 이상에서 POST_NOTIFICATIONS 권한 요청
        if (Platform.OS === 'android' && Platform.Version >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          );

          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert('알림 권한이 필요합니다.');
            return;
          }
        }

        // iOS 또는 권한 승인된 Android
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          const fcmToken = await messaging().getToken();
          console.log('FCM 디바이스 토큰:', fcmToken);
          setFcmToken(fcmToken);
        } else {
          Alert.alert('알림 권한이 거부되었습니다.');
        }
      } catch (error) {
        console.log('FCM 권한 요청 실패:', error);
      }
    };

    requestUserPermission();

    // 토큰 갱신 처리
    const unsubscribe = messaging().onTokenRefresh(newToken => {
      setFcmToken(newToken);
    });

    return unsubscribe;
  }, []);
};

export default useFCM;
