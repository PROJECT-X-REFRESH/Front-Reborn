import React, {useState} from 'react';
import {Dimensions, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NpsText} from '../../components/CustomText';
import * as Keychain from 'react-native-keychain';
import styled from 'styled-components/native';
import colors from '../../constants/colors';

import {post} from '../../services/api';
import config from '../../constants/config';

const {width, height} = Dimensions.get('window');

const NicknameScreen = ({navigation: {navigate}}) => {
  const navigation = useNavigation();
  const [nickname, setNickame] = useState('');

  const saveNickname = async () => {
    if (!nickname.trim()) {
      Alert.alert('입력 오류', '닉네임을 입력해주세요.');
      return;
    }

    try {
      const accessData = await Keychain.getGenericPassword();
      const token = accessData?.password;

      const payload = {
        nickname: nickname.trim(),
      };

      const response = await post(config.USERS.NICKNAME, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.isSuccess) {
        navigate('PetProfileAdd'); // 🔁 성공 시 PetProfileAdd로 이동
      } else {
        Alert.alert('실패', response.message || '닉네임 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('프로필 저장 실패:', error);
      Alert.alert('에러', '네트워크 오류 또는 서버 문제입니다.');
    }
  };

  return (
    <Container>
      <TitleContainer>
        <TitleText>
          <HBHighlightText>RE</HBHighlightText>BORN
        </TitleText>
        <SubTitleText>닉네임을 입력해 주세요!</SubTitleText>
      </TitleContainer>
      <TutorialImageContainer>
        <TutorialImage
          source={require('../../assets/images/logos/logo_intro.png')}
        />
      </TutorialImageContainer>
      <Label>닉네임</Label>
      <Input
        value={nickname}
        onChangeText={setNickame}
        placeholder="닉네임을 입력하세요"
        placeholderTextColor={colors.gray300}
      />

      <SaveButtonContainer>
        <SaveButton onPress={saveNickname}>
          <SaveText>저장</SaveText>
        </SaveButton>
      </SaveButtonContainer>
    </Container>
  );
};

export default NicknameScreen;

const Container = styled.View`
  flex: 1;
  background-color: ${colors.white};
  padding: ${height * 0.08}px ${width * 0.06}px;
`;

const TitleContainer = styled.View`
  align-items: center;
`;

const TitleText = styled.Text`
  font-size: ${width * 0.12}px;
  font-family: 'Hakgyoansim Dunggeunmiso TTF B';
  color: ${colors.brown};
  margin: 10px;
`;

const SubTitleText = styled(NpsText)`
  font-size: ${width * 0.04}px;
  color: ${colors.brown};
`;

const HBHighlightText = styled.Text`
  font-size: ${width * 0.12}px;
  color: ${colors.yellow};
  font-family: 'Hakgyoansim Dunggeunmiso TTF B';
`;

const Label = styled(NpsText)`
  padding: ${height * 0.02}px 0;
  font-size: ${width * 0.038}px;
  color: ${colors.brown};
`;

const Input = styled.TextInput`
  width: 100%;
  height: ${height * 0.07}px;
  border: 1px solid ${colors.gray200};
  border-radius: 5px;
  padding: ${height * 0.02}px;
  text-align: left;
  vertical-align: center;
  color: ${colors.brown};
  font-family: 'NPSfont_regular';
  font-size: ${width * 0.034}px;
`;

const TutorialImageContainer = styled.View`
  align-items: center;
  justify-content: center;
`;

const TutorialImage = styled.Image`
  width: 80%;
  height: undefined;
  aspect-ratio: 1;
  margin: 30px 0;
`;

const SaveButtonContainer = styled.View`
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const SaveButton = styled.TouchableOpacity`
  background-color: ${colors.brown};
  padding: ${height * 0.022}px;
  align-items: center;
  border-radius: 5px;
  margin-top: ${height * 0.05}px;
  width: ${width * 0.42}px;
`;

const SaveText = styled(NpsText)`
  color: ${colors.white};
  font-size: ${width * 0.038}px;
`;
