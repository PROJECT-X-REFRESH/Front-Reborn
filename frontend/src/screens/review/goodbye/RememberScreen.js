import React, {useState, useEffect} from 'react';
import {Dimensions, Modal} from 'react-native';
import styled from 'styled-components/native';
import colors from '../../../constants/colors';
import ImageDiary from '../../../components/ImageDiary';
import {get} from '../../../services/api';
import config from '../../../constants/config';

const {width, height} = Dimensions.get('window');

const RevealScreen = ({route}) => {
  const {id} = route.params;

  const [contents, setContents] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [date, setDate] = useState(null);

  useEffect(() => {
    const fetchRememberData = async () => {
      try {
        const res = await get(config.FAREWELL.REVIEW_REMEMBER(0, id));
        const result = res.result;
        console.log('fff', result);
        setContents(result.contents);
        setImageUrl(result.url);
        setDate(result.createdAt.split('T')[0]);
      } catch (err) {
        console.error('사진 일기 데이터 불러오기 실패:', err);
      }
    };

    fetchRememberData();
  }, [id]);

  return (
    <Container>
      <EmotionDiaryWrapper>
        <ImageDiary
          editable={false}
          initialContent={contents}
          initialImage={imageUrl}
          initialDate={date}
        />
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
