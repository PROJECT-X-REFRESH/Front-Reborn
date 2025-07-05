import {launchImageLibrary} from 'react-native-image-picker';
import {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Dimensions, TouchableOpacity, Image, Modal, Alert} from 'react-native';
import {NpsText, NpsBText} from '../../components/CustomText';
import {get, post, del} from '../../services/api';
import config from '../../constants/config';
import * as Keychain from 'react-native-keychain';
import styled from 'styled-components/native';
import colors from '../../constants/colors';
import UserIcon from '../../assets/images/others/profile.svg';

const {width, height} = Dimensions.get('window');

const MypageScreen = ({navigation: {navigate}}) => {
  const navigation = useNavigation();

  const [profileImage, setProfileImage] = useState(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const accessData = await Keychain.getGenericPassword();
      const tokenObj = JSON.parse(accessData?.password);
      const accessToken = tokenObj.accessToken;

      const res = await get(
        config.USERS.INFO,
        {},
        {
          headers: {
            Authorization: `${accessToken}`,
          },
        },
      );

      if (res?.isSuccess && res?.result) {
        const {name, email, profileImage} = res.result;
        setUserName(name);
        setUserEmail(email);
        setProfileImage(profileImage);
      } else {
        console.warn('유저 정보 요청 실패:', res?.message);
      }
    } catch (error) {
      console.error('유저 정보 요청 에러:', error);
    }
  };

  const uploadProfileImage = async uri => {
    try {
      const formData = new FormData();
      formData.append('profile', {
        uri,
        name: 'profile.jpg',
        type: 'image/jpeg',
      });

      const res = await post(config.USERS.UPLOAD_IMAGE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res?.isSuccess) {
        Alert.alert('업로드 완료', '프로필 이미지가 변경되었습니다.');
      } else {
        Alert.alert('업로드 실패', res?.message || '오류 발생');
      }
    } catch (e) {
      console.error('업로드 실패:', e);
      Alert.alert('에러', '네트워크 또는 서버 오류입니다.');
    }
  };

  const handleChangeProfileImage = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (!response.didCancel && !response.errorCode) {
        const uri = response.assets[0].uri;
        setProfileImage(uri);
        uploadProfileImage(uri);
      }
    });
  };

  const handleWithdraw = async () => {
    try {
      const res = await del(config.USERS.DELETE_ME);

      console.log('탈퇴 응답:', res);

      if (res?.isSuccess) {
        await Keychain.resetGenericPassword();
        Alert.alert('탈퇴 완료', '계정이 삭제되었습니다.');
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'IntroStackNavigator',
              params: {screen: 'LoginScreen'},
            },
          ],
        });
      } else {
        console.log('탈퇴 응답:', res);
        Alert.alert('탈퇴 실패', res?.message || '오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('탈퇴 에러:', error);
      Alert.alert('에러', '네트워크 오류 또는 서버 문제입니다.');
    }
  };

  const handleLogout = async () => {
    try {
      const res = await del(config.USERS.LOGOUT);

      console.log('로그아웃 응답:', res);

      if (res?.isSuccess) {
        await Keychain.resetGenericPassword();
        Alert.alert('로그아웃 완료', '성공적으로 로그아웃되었습니다.');
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'IntroStackNavigator',
              params: {screen: 'LoginScreen'},
            },
          ],
        });
      } else {
        console.log('로그아웃 응답:', res);
        Alert.alert('로그아웃 실패', res?.message || '오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('로그아웃 에러:', error);
      Alert.alert('에러', '네트워크 오류 또는 서버 문제입니다.');
    }
  };

  return (
    <Container>
      <Modal
        transparent
        visible={showWithdrawModal}
        animationType="fade"
        onRequestClose={() => setShowWithdrawModal(false)}>
        <ModalOverlay>
          <ModalContainer>
            <ModalTitle>정말 탈퇴하시겠습니까?</ModalTitle>
            <ModalDesc>
              탈퇴 버튼 선택 시 계정은{'\n'}삭제되며 복구되지 않습니다.
            </ModalDesc>
            <ModalButtonRow>
              <ConfirmButton onPress={handleWithdraw}>
                <ConfirmButtonText>탈퇴</ConfirmButtonText>
              </ConfirmButton>
              <CancelButton onPress={() => setShowWithdrawModal(false)}>
                <CancelButtonText>취소</CancelButtonText>
              </CancelButton>
            </ModalButtonRow>
          </ModalContainer>
        </ModalOverlay>
      </Modal>

      <Modal transparent visible={showLogoutModal} animationType="fade">
        <ModalOverlay>
          <ModalContainer>
            <LogoutTitle>정말 로그아웃하시겠습니까?</LogoutTitle>
            <ModalButtonRow>
              <LogoutButton onPress={handleLogout}>
                <ConfirmButtonText>로그아웃</ConfirmButtonText>
              </LogoutButton>
              <CancelButton onPress={() => setShowLogoutModal(false)}>
                <CancelButtonText>취소</CancelButtonText>
              </CancelButton>
            </ModalButtonRow>
          </ModalContainer>
        </ModalOverlay>
      </Modal>

      <ProfileContainer>
        <ProfileImageContainer>
          <TouchableOpacity onPress={handleChangeProfileImage}>
            {profileImage ? (
              <Image
                source={{uri: profileImage}}
                style={{
                  width: width * 0.25,
                  height: width * 0.25,
                  borderRadius: 50,
                }}
              />
            ) : (
              <UserIcon width={width * 0.12} height={width * 0.12} />
            )}
          </TouchableOpacity>
        </ProfileImageContainer>
        <ProfileTextContainer>
          <UserName>{userName}</UserName>
          <UserEmail>{userEmail}</UserEmail>
        </ProfileTextContainer>
      </ProfileContainer>

      <MenuContainer>
        <MenuItem
          onPress={() =>
            navigate('MypageStackNavigator', {screen: 'PetProfileList'})
          }>
          <MenuText>반려동물 프로필 관리</MenuText>
        </MenuItem>
        <MenuItem onPress={() => setShowWithdrawModal(true)}>
          <MenuText>회원탈퇴</MenuText>
        </MenuItem>
        <MenuItem onPress={() => setShowLogoutModal(true)}>
          <MenuText>로그아웃</MenuText>
        </MenuItem>
      </MenuContainer>

      <Divider />

      <MenuContainer>
        <AppInfoRow>
          <AppInfoText>앱 버전</AppInfoText>
          <AppInfoValue>2.4.1</AppInfoValue>
        </AppInfoRow>
        <MenuItem>
          <MenuText>서비스 이용약관</MenuText>
        </MenuItem>
        <MenuItem>
          <MenuText>개인정보 처리방침</MenuText>
        </MenuItem>
      </MenuContainer>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: ${colors.white};
  padding: ${height * 0.02}px ${width * 0.06}px;
`;

const ProfileContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding: ${height * 0.02}px 0;
`;

const ProfileImageContainer = styled.View`
  width: ${width * 0.25}px;
  height: ${width * 0.25}px;
  border-radius: 50px;
  justify-content: center;
  align-items: center;
  background-color: ${colors.gray200};
  margin-right: ${width * 0.05}px;
`;

const ProfileTextContainer = styled.View`
  flex-direction: column;
`;

const UserName = styled(NpsBText)`
  font-size: ${width * 0.05}px;
  color: ${colors.brown};
`;

const UserEmail = styled(NpsBText)`
  font-size: ${width * 0.04}px;
  color: ${colors.brown};
  margin-top: ${height * 0.015}px;
`;

const MenuContainer = styled.View``;

const MenuItem = styled.TouchableOpacity`
  padding: ${height * 0.02}px 0;
`;

const MenuText = styled(NpsText)`
  font-size: ${width * 0.04}px;
`;

const Divider = styled.View`
  height: 1px;
  background-color: ${colors.gray200};
  margin: ${height * 0.015}px 0;
`;

const AppInfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: ${height * 0.02}px 0;
`;

const AppInfoText = styled(NpsText)`
  font-size: ${width * 0.04}px;
`;

const AppInfoValue = styled(NpsText)`
  font-size: ${width * 0.04}px;
`;

const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.4);
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.View`
  width: 80%;
  background-color: white;
  border-radius: 16px;
  padding: 40px;
  align-items: center;
`;

const ModalTitle = styled(NpsBText)`
  font-size: ${width * 0.045}px;
  color: ${colors.brown};
  margin-bottom: 12px;
`;

const LogoutTitle = styled(NpsBText)`
  font-size: ${width * 0.045}px;
  color: ${colors.brown};
  margin-bottom: 30px;
`;

const ModalDesc = styled(NpsText)`
  font-size: ${width * 0.035}px;
  color: ${colors.brown};
  text-align: center;
  line-height: ${width * 0.06}px;
  margin-bottom: 20px;
`;

const ModalButtonRow = styled.View`
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  gap: 12px;
`;

const ConfirmButton = styled.TouchableOpacity`
  flex: 1;
  background-color: ${colors.red};
  padding: 12px;
  border-radius: 8px;
  align-items: center;
`;

const LogoutButton = styled.TouchableOpacity`
  flex: 1;
  background-color: ${colors.brown};
  padding: 12px;
  border-radius: 8px;
  align-items: center;
`;

const CancelButton = styled.TouchableOpacity`
  flex: 1;
  border: 1px solid ${colors.brown};
  padding: 12px;
  border-radius: 8px;
  align-items: center;
`;

const ConfirmButtonText = styled(NpsText)`
  color: white;
  font-size: ${width * 0.035}px;
`;

const CancelButtonText = styled(NpsText)`
  color: ${colors.brown};
  font-size: ${width * 0.035}px;
`;

export default MypageScreen;
