import React, {useEffect} from 'react';
import {Dimensions, Linking, Alert} from 'react-native';
import styled from 'styled-components/native';
import colors from '../../constants/colors';
import {NpsText} from '../../components/CustomText';
import {useNavigation} from '@react-navigation/native';
import * as Keychain from 'react-native-keychain';
import {useFcmContext} from '../../context/FcmContext';

import RebornLogo from '../../assets/images/logos/logo_reborn.png';
import NaverLogo from '../../assets/images/logos/logo_naver.svg';
import GoogleLogo from '../../assets/images/logos/logo_google.svg';
import KakaoLogo from '../../assets/images/logos/logo_kakao.svg';

const {width} = Dimensions.get('window');
const API_URL = 'http://api.x-reborn.com';

const LoginScreen = () => {
  const navigation = useNavigation();
  const {fcmToken} = useFcmContext();

  const handleTutorial = () => {
    navigation.navigate('TutorialScreen');
  };

  // 딥링크 수신 처리
  useEffect(() => {
    // URL에서 code 추출
    const getCodeFromUrl = url => {
      const match = url.match(/[?&]code=([^&]+)/);
      return match ? decodeURIComponent(match[1]) : null;
    };

    const handleDeepLink = async ({url}) => {
      console.log('딥링크 수신됨:', url);

      try {
        const code = getCodeFromUrl(url);
        if (!code) return console.log('code 없음');

        console.log('받은 code:', code);

        const res = await fetch(`${API_URL}/token/return`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({code: code, deviceToken: fcmToken}),
        });

        const data = await res.json();
        console.log('서버 응답:', data);

        const {accessToken, refreshToken, signIn} = data.result;

        console.log(accessToken);

        await Keychain.setGenericPassword(
          'token',
          JSON.stringify({accessToken, refreshToken}),
        );

        if (signIn === 'wasUser') {
          navigation.reset({
            index: 0,
            routes: [{name: 'TabNavigator'}],
          });
        } else if (signIn === 'newUser') {
          navigation.reset({
            index: 0,
            routes: [{name: 'TutorialScreen'}],
          });
        } else {
          console.log('알 수 없는 회원 상태');
        }
      } catch (error) {
        console.error('딥링크 처리 중 에러:', error);
      }
    };

    // 앱이 처음 시작되었을 때 딥링크 처리
    Linking.getInitialURL().then(url => {
      if (url) handleDeepLink({url});
    });

    // 앱 실행 중일 때 딥링크 수신
    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => {
      subscription.remove();
    };
  }, []);

  const openOAuthLogin = async provider => {
    const loginUrl = `${API_URL}/oauth2/authorization/${provider}`;
    await Linking.openURL(loginUrl);
  };

  return (
    <Container>
      <TopContainer>
        <Logo source={RebornLogo} resizeMode="contain" />
        <RebornTitle>
          <Yellow>RE</Yellow>
          <Brown>BORN</Brown>
        </RebornTitle>
      </TopContainer>

      <ButtonWrapper>
        <LoginButton bgColor="#03C75A" onPress={() => openOAuthLogin('naver')}>
          <NaverLogo width={18} height={18} />
          <ButtonText style={{color: colors.white}}>네이버 로그인</ButtonText>
        </LoginButton>

        <LoginButton bgColor="#FEE500" onPress={() => openOAuthLogin('kakao')}>
          <KakaoLogo width={18} height={18} />
          <ButtonText style={{color: colors.black}}>카카오 로그인</ButtonText>
        </LoginButton>

        {/*<LoginButton border onPress={() => handleTutorial()}>
          <GoogleLogo width={18} height={18} />
          <ButtonText style={{ color: '#1F1F1F' }}>구글 로그인</ButtonText>
        </LoginButton>*/}
      </ButtonWrapper>
    </Container>
  );
};

export default LoginScreen;

const Container = styled.View`
  flex: 1;
  background-color: ${colors.white};
  align-items: center;
  justify-content: center;
`;

const TopContainer = styled.View`
  align-items: center;
  margin-bottom: ${width * 0.15}px;
`;

const Logo = styled.Image`
  width: ${width * 0.35}px;
  height: ${width * 0.35}px;
  margin-bottom: ${width * 0.04}px;
`;

const RebornTitle = styled.View`
  flex-direction: row;
`;

const Yellow = styled.Text`
  color: ${colors.yellow};
  font-family: 'Hakgyoansim Dunggeunmiso TTF B';
  font-size: ${width * 0.08}px;
`;

const Brown = styled.Text`
  color: ${colors.brown};
  font-family: 'Hakgyoansim Dunggeunmiso TTF B';
  font-size: ${width * 0.08}px;
`;

const ButtonWrapper = styled.View`
  width: 70%;
  gap: 12px;
`;

const LoginButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background-color: ${props => props.bgColor || 'white'};
  border: ${props => (props.border ? `1px solid #747775` : 'none')};
  border-radius: 10px;
  padding: 14px;
`;

const ButtonText = styled(NpsText)`
  font-size: ${width * 0.045}px;
`;
