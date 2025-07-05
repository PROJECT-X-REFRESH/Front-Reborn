import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import Letter from '../../../components/Letter';
import colors from '../../../constants/colors';
import {Dimensions} from 'react-native';
import {get} from '../../../services/api';
import config from '../../../constants/config';

const {width, height} = Dimensions.get('window');

const RebirthScreen = ({route}) => {
  const {id} = route.params;
  const [content, setContent] = useState('');
  const [toName, setToName] = useState('');
  const [fromName, setFromName] = useState('');

  useEffect(() => {
    console.log('id: ', id);
    const fetchLetter = async () => {
      try {
        const res = await get(config.FAREWELL.REVIEW_REBIRTH(0, id));
        const result = res.result;
        setContent(result.petPost || '');
        setToName(result.username || '');
        setFromName(result.petName || '');
      } catch (err) {
        console.error('편지 불러오기 실패:', err);
      }
    };
    fetchLetter();
  }, [id]);

  return (
    <Container>
      <Letter
        isInput={false}
        content={content}
        toName={toName}
        fromName={fromName}
      />
    </Container>
  );
};

export default RebirthScreen;

const Container = styled.View`
  flex: 1;
  background-color: ${colors.white};
  padding: ${height * 0.03}px ${width * 0.06}px;
`;
