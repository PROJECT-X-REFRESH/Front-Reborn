import React, { useState } from 'react';
import {
  Alert,
  View,
  Dimensions,
  TextInput,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import styled from 'styled-components/native';
import * as Keychain from 'react-native-keychain';
import { launchImageLibrary } from 'react-native-image-picker';
import { postWithFormData } from '../../services/api';
import config from '../../constants/config';

import colors from '../../constants/colors';

import BackButton from '../../components/BackButton';
import ImageIcon from '../../assets/images/others/add_img.svg';

const { width, height } = Dimensions.get('window');

const BoardWriteScreen = ({ navigation, route }) => {
  const { category = 'POST' } = route.params || {};

  const [content, setContent] = useState('');
  const [imageUri, setImageUri] = useState(null);

  const handleImagePick = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (
        !response.didCancel &&
        response.assets &&
        response.assets.length > 0
      ) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const handlePost = async () => {
    try {
      const formData = new FormData();

      formData.append(
        'data',
        JSON.stringify({
          category,
          content,
        }),
      );

      if (imageUri) {
        const filename = imageUri.split('/').pop();
        const fileType = filename.split('.').pop();

        formData.append('board', {
          uri: imageUri,
          name: filename,
          type: `image/${fileType}`,
        });
      }

      const accessData = await Keychain.getGenericPassword();
      const accessToken = JSON.parse(accessData?.password)?.accessToken;

      const response = await postWithFormData(config.BOARD.CREATE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.isSuccess) {
        Alert.alert('성공', '게시물이 등록되었습니다.');
        navigation.goBack();
      } else {
        Alert.alert('실패', response.message || '게시물 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('게시물 작성 오류:', error);
      Alert.alert('에러', '네트워크 오류 또는 서버 문제입니다.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="height"
      keyboardVerticalOffset={0}
    >
      <Container>
        <Header>
          <TouchableOpacity>
            <BackButton onPress={() => navigation.goBack()} />
          </TouchableOpacity>
          <HeaderTitle>글쓰기</HeaderTitle>
          <TouchableOpacity onPress={handlePost}>
            <DoneButton>
              <HeaderDone>완료</HeaderDone>
            </DoneButton>
          </TouchableOpacity>
        </Header>
        <Line />

        <ContentContainer>
          <ContentInput
            placeholder="내용을 입력하세요..."
            multiline
            value={content}
            onChangeText={setContent}
            placeholderTextColor="#999"
          />
          {imageUri && <PreviewImage source={{ uri: imageUri }} />}
        </ContentContainer>

        <BottomButtonContainer>
          <BottomLine />
          <CameraButton onPress={handleImagePick}>
            <ImageIcon />
          </CameraButton>
        </BottomButtonContainer>
      </Container>
    </KeyboardAvoidingView>
  );
};

export default BoardWriteScreen;

// Styled Components

const Container = styled.View`
  flex: 1;
  background-color: ${colors.white};
`;

const Header = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${height * 0.02}px;
  margin-top: ${height * 0.05}px;
`;

const HeaderTitle = styled(Text)`
  font-size: ${width * 0.045}px;
  font-family: 'NPSfont_extrabold';
  color: ${colors.brown};
  margin-top: ${width * 0.07}px;
`;

const HeaderDone = styled(Text)`
  color: ${colors.white};
  font-family: 'NPSfont_bold';
  font-size: ${width * 0.038}px;
`;

const DoneButton = styled(View)`
  background-color: ${colors.brown};
  align-items: center;
  border-radius: 20px;
  justify-content: center;
  padding: ${width * 0.02}px ${width * 0.04}px;
  margin-top: ${height * 0.03}px;
  margin-right: ${width * 0.05}px;
`;

const ContentContainer = styled.View`
  padding: ${height * 0.02}px ${width * 0.06}px;
  margin-bottom: 2%;
`;

const ContentInput = styled(TextInput)`
  color: ${colors.brown};
  font-family: 'NPSfont_regular';
  font-size: ${width * 0.034}px;
`;

const PreviewImage = styled(Image)`
  width: ${width * 0.2}px;
  height: ${width * 0.2}px;
  border-radius: 8px;
  margin: 5%;
`;

const CameraButton = styled(TouchableOpacity)`
  margin: ${width * 0.03}px;
`;

const Line = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: ${colors.gray200};
  margin-bottom: 5%;
  margin: 0px 5%;
`;

const BottomButtonContainer = styled.View`
  position: absolute;
  bottom: ${height * 0.03}px;
  left: 0;
  width: 100%;
  padding: 0 ${width * 0.04}px;
  background-color: ${colors.white};
`;

const BottomLine = styled.View`
  width: 100%;
  height: 1px;
  background-color: ${colors.gray200};
`;
