import React from 'react';
import {Dimensions, Alert} from 'react-native';
import styled from 'styled-components/native';
import colors from './../../constants/colors';
import ImageDiary from '../../components/ImageDiary';
import {useReborn} from './../../context/RebornContext';

import config from '../../constants/config';
import {postWithFormData} from '../../services/api';
import * as Keychain from 'react-native-keychain';

const {width, height} = Dimensions.get('window');

const ImageDiaryScreen = ({navigation: {navigate}}) => {
  const {farewellId, setIsContents1} = useReborn();

  const handleSaveImage = async ({contents, imageUri}) => {
    try {
      const formData = new FormData();

      formData.append(
        'data',
        JSON.stringify({
          contents,
        }),
      );

      if (imageUri) {
        const filename = imageUri.split('/').pop();
        const fileType = filename.split('.').pop();

        formData.append('remember', {
          uri: imageUri,
          name: filename,
          type: `image/${fileType}`,
        });
      }

      const accessData = await Keychain.getGenericPassword();
      const accessToken = JSON.parse(accessData?.password)?.accessToken;

      const response = await postWithFormData(
        config.REMEMBER.CREATE_DIARY(farewellId),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (response.isSuccess) {
        Alert.alert('성공', '사진일기 저장 성공');
        setIsContents1(true);
        navigate('RebornStackNavigator', {
          screen: 'RebornMainScreen',
        });
      } else {
        Alert.alert('실패', response.message || '사진일기 저장 실패');
      }
    } catch (error) {
      console.error('사진일기 저장 오류:', error);
      Alert.alert('에러', '네트워크 오류 또는 서버 문제입니다.');
    }
  };

  return (
    <Container>
      <ImageDiaryWrapper>
        <ImageDiary onPress={handleSaveImage} />
      </ImageDiaryWrapper>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: ${colors.white};
  padding: ${height * 0.02}px 0 0 0;
  align-items: center;
`;

const ImageDiaryWrapper = styled.View`
  width: 90%;
  height: 94%;
`;

export default ImageDiaryScreen;
