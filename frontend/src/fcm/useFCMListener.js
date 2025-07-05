import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';
import { reset } from '../navigation/NavigationService';

const useFCMListener = () => {
  const handleNavigateToPost = (data) => {
    const postId = data.boardId;
    if (!postId) return;

    reset([
      {
        name: 'TabNavigator',
        state: {
          routes: [
            {
              name: 'Board',
              state: {
                routes: [
                  {
                    name: 'BoardDetailScreen',
                    params: { boardId: postId },
                  },
                ],
              },
            },
          ],
        },
      },
    ]);
  };

  useEffect(() => {
    const unsubscribeOnMessage = messaging().onMessage(async (remoteMessage) => {
      const { title, body } = remoteMessage.notification || {};
      const data = remoteMessage.data || {};

      Toast.show({
        type: 'info',
        text1: title || '알림',
        text2: body || '',
        position: 'top',
        visibilityTime: 4000,
        autoHide: true,
        onPress: () => handleNavigateToPost(data),
      });
    });

    const unsubscribeOnNotificationOpened = messaging().onNotificationOpenedApp((remoteMessage) => {
      const data = remoteMessage?.data;
      if (data?.boardId) handleNavigateToPost(data);
    });

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        const data = remoteMessage?.data;
        if (data?.boardId) handleNavigateToPost(data);
      });

    return () => {
      unsubscribeOnMessage();
      unsubscribeOnNotificationOpened();
    };
  }, []);
};

export default useFCMListener;
