import React, {useState, useEffect} from 'react';
import {Dimensions} from 'react-native';
import styled from 'styled-components/native';
import colors from '../../../constants/colors';
import {NpsBText} from '../../../components/CustomText';

import AnimalFace from '../../memory/AnimalFace';

import {get} from '../../../services/api';
import config from '../../../constants/config';

const {width, height} = Dimensions.get('window');

const RemindScreen = ({route}) => {
  const {petCase, color, remindId} = route.params;

  const [petName, setPetName] = useState('');
  const [userName, setUserName] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchRemindDetail = async () => {
      try {
        const res = await get(config.REMIND.DETAIL(remindId));
        setPetName(res.result.petName);
        setUserName(res.result.userName);
        setTitle(res.result.title);
        setContent(res.result.content);
      } catch (e) {
        console.error('REMIND 상세 조회 실패:', e);
        Alert.alert('불러오기 실패', '답변 내용을 불러오지 못했습니다.');
      }
    };

    fetchRemindDetail();
  }, [remindId]);

  return (
    <Container>
      <AnimalFace animalType={petCase} animalColor={color} />

      <QuestionWrapper>
        <PetName>{petName}</PetName>
        <Question>Q. {title}</Question>
      </QuestionWrapper>

      <AnswerWrapper>
        <UserName>{userName}</UserName>
        <Answer>{content}</Answer>
      </AnswerWrapper>
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

const Answer = styled.Text`
  flex: 1;
  text-align: left;
  text-align-vertical: top;
  font-family: 'KyoboHandwriting2019';
  font-size: ${width * 0.045};
`;
