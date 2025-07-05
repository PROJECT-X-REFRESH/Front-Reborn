import React, {useState, useEffect} from 'react';
import {Dimensions, Alert} from 'react-native';
import styled from 'styled-components/native';
import colors from './../../constants/colors';
import {NpsBText} from '../../components/CustomText';

import AnimalFace from './AnimalFace';

import {get, post, put, del} from '../../services/api';
import config from '../../constants/config';

const {width, height} = Dimensions.get('window');

const RemindScreen = ({navigation, route}) => {
  const {petId, petCase, color, remindId, remindMessage} = route.params;
  const isEditMode = remindId !== null && remindId !== undefined;

  const [petName, setPetName] = useState('');
  const [userName, setUserName] = useState('');
  const [answerText, setAnswerText] = useState('');

  useEffect(() => {
    if (isEditMode) {
      const fetchRemind = async () => {
        try {
          const res = await get(config.REMIND.DETAIL(remindId));
          setAnswerText(res.result.content);
          setPetName(res.result.petName);
          setUserName(res.result.userName);
        } catch (e) {
          console.error('답변 불러오기 실패:', e);
          Alert.alert('오류', '기존 답변을 불러올 수 없습니다.');
        }
      };
      fetchRemind();
    }
  }, [remindId]);

  const handleSave = async () => {
    if (!answerText.trim()) {
      Alert.alert('입력 오류', '답변을 입력해주세요.');
      return;
    }

    try {
      if (isEditMode) {
        await put(config.REMIND.UPDATE(remindId), {
          title: remindMessage,
          content: answerText,
        });
        Alert.alert('수정 완료', '답변이 수정되었습니다.');
      } else {
        await post(config.REMIND.CREATE(petId), {
          title: remindMessage,
          content: answerText,
        });
        Alert.alert('저장 완료', '답변이 저장되었습니다.');
      }
      navigation.goBack();
    } catch (e) {
      console.error('저장/수정 실패:', e);
      Alert.alert('저장 실패', '다시 시도해주세요.');
    }
  };

  const handleDelete = async () => {
    try {
      await del(config.REMIND.DELETE(petId, remindId));
      Alert.alert('삭제 완료', '답변이 삭제되었습니다.');
      navigation.goBack();
    } catch (e) {
      console.error('삭제 실패:', e);
      Alert.alert('삭제 실패', '다시 시도해주세요.');
    }
  };

  return (
    <Container>
      <AnimalFace animalType={petCase} animalColor={color} />

      <QuestionWrapper>
        <PetName>{petName}</PetName>
        <Question>Q. {remindMessage}</Question>
      </QuestionWrapper>

      <AnswerWrapper>
        <UserName>{userName}</UserName>
        <AnswerInput
          value={answerText}
          onChangeText={setAnswerText}
          placeholder="답변을 작성해 주세요."
          placeholderTextColor={colors.gray300}
          multiline
        />
      </AnswerWrapper>

      <ButtonRow>
        {isEditMode && (
          <DeleteButton onPress={handleDelete}>
            <DeleteButtonText>삭제</DeleteButtonText>
          </DeleteButton>
        )}
        <SaveButton onPress={handleSave}>
          <SaveButtonText>{isEditMode ? '수정' : '저장'}</SaveButtonText>
        </SaveButton>
      </ButtonRow>
    </Container>
  );
};

export default RemindScreen;

const Container = styled.View`
  flex: 1;
  padding: ${height * 0.03}px ${width * 0.06}px;
  background-color: ${colors.white};
`;

const QuestionWrapper = styled.View``;

const PetName = styled(NpsBText)`
  font-size: ${width * 0.045}px;
  color: ${colors.brown};
  margin-bottom: 10px;
`;

const Question = styled.Text`
  font-family: 'KyoboHandwriting2019';
  font-size: ${width * 0.045}px;
  color: ${colors.black};
  margin-bottom: 16px;
`;

const AnswerWrapper = styled.View`
  flex: 1;
`;

const UserName = styled(NpsBText)`
  font-size: ${width * 0.045}px;
  color: ${colors.brown};
  margin-bottom: 10px;
`;

const AnswerInput = styled.TextInput`
  flex: 1;
  text-align: left;
  text-align-vertical: top;
  font-family: 'KyoboHandwriting2019';
  font-size: ${width * 0.045};
  placeholder-text-color: ${colors.gray300};
`;

const SaveButton = styled.TouchableOpacity`
  background-color: ${colors.brown};
  margin-top: 10px;
  align-self: flex-end;
  padding: 6px 18px;
  border-radius: 24px;
`;

const SaveButtonText = styled(NpsBText)`
  color: ${colors.white};
  font-size: ${width * 0.038}px;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  gap: 12px;
`;

const DeleteButton = styled.TouchableOpacity`
  background-color: ${colors.red};
  align-self: flex-end;
  padding: 6px 18px;
  border-radius: 24px;
`;

const DeleteButtonText = styled(NpsBText)`
  color: ${colors.white};
  font-size: ${width * 0.038}px;
`;
