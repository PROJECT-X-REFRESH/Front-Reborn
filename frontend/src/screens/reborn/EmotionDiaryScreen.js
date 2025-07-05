import React from 'react';
import {Dimensions, Alert} from 'react-native';
import styled from 'styled-components/native';
import colors from './../../constants/colors';
import EmotionDiary from './../../components/EmotionDiary';
import {useReborn} from './../../context/RebornContext';
import {post} from '../../services/api';

import config from '../../constants/config';

const {width, height} = Dimensions.get('window');

const EmotionDiaryScreen = ({navigation: {navigate}}) => {
  const {farewellId, setIsContents1} = useReborn();

  const handleSaveEmotion = async ({content, emotion}) => {
    try {
      await post(config.REVEAL.WRITE(farewellId), {
        contents: content,
        emotionState: emotion.state,
      });
      Alert.alert('저장 완료', '감정일기가 성공적으로 저장되었습니다.');
      setIsContents1(true);
      navigate('RebornStackNavigator', {
        screen: 'RebornMainScreen',
      });
    } catch (e) {
      console.error('감정일기 저장 실패:', e);
      Alert.alert('실패', '다시 시도해주세요.');
    }
  };

  return (
    <Container>
      <EmotionDiaryWrapper>
        <EmotionDiary onPress={handleSaveEmotion} />
      </EmotionDiaryWrapper>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: ${colors.white};
  padding: ${height * 0.02}px 0 0 0;
  align-items: center;
`;

const EmotionDiaryWrapper = styled.View`
  width: 90%;
  height: 94%;
`;

export default EmotionDiaryScreen;
