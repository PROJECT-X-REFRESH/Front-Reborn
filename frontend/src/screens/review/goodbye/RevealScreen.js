import React, {useState, useEffect} from 'react';
import {Dimensions, ActivityIndicator, Alert} from 'react-native';
import styled from 'styled-components/native';
import colors from '../../../constants/colors';
import EmotionDiary from '../../../components/EmotionDiary';
import {get} from '../../../services/api';
import config from '../../../constants/config';

const {width, height} = Dimensions.get('window');

const RevealScreen = ({route}) => {
  const {id} = route.params;

  const [content, setContent] = useState('');
  const [emotion, setEmotion] = useState('default');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('reveal: ', id);
    const fetchRevealDetail = async () => {
      console.log('API 요청 경로:', config.FAREWELL.REVIEW_REVEAL(0, id));
      try {
        const res = await get(config.FAREWELL.REVIEW_REVEAL(0, id));
        const result = res.result;
        setContent(result.contents);
        setEmotion(result.emotionState || 'default');
      } catch (e) {
        console.error('감정일기 조회 실패:', e);
        Alert.alert('조회 실패', '감정일기를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchRevealDetail();
  }, [id]);

  return (
    <Container>
      <EmotionDiaryWrapper>
        {loading ? (
          <ActivityIndicator size="large" color={colors.brown} />
        ) : (
          <EmotionDiary
            editable={false}
            defaultContents={content}
            defaultEmotion={emotion}
          />
        )}
      </EmotionDiaryWrapper>
    </Container>
  );
};

export default RevealScreen;

const Container = styled.View`
  flex: 1;
  padding: ${height * 0.03}px ${width * 0.06}px;
  background-color: ${colors.white};
`;

const EmotionDiaryWrapper = styled.View`
  width: 100%;
  height: 90%;
`;
