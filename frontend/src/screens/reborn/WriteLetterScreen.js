import React, {useState} from 'react';
import {Dimensions} from 'react-native';
import styled from 'styled-components/native';
import colors from './../../constants/colors';
import Letter from './../../components/Letter';
import {useReborn} from './../../context/RebornContext';
import {post} from '../../services/api';

import config from '../../constants/config';

const {width, height} = Dimensions.get('window');

const WriteLetterScreen = ({navigation: {navigate}}) => {
  const {farewellId, petName} = useReborn();

  const [writeLetterContents, setWriteLetterContents] = useState(''); // 편지쓰기 내용

  const fetchLetter = async () => {
    try {
      await post(config.REBIRTH.WRITE(farewellId), {
        petPost: writeLetterContents,
      });

      navigate('RebornStackNavigator', {
        screen: 'RebirthScreen',
        params: {contents: writeLetterContents},
      });
    } catch (e) {
      console.error('편지 실패:', e);
    }
  };

  return (
    <Container>
      <LetterWrapper>
        <Letter
          isInput={true}
          onPress={fetchLetter}
          contents={writeLetterContents}
          setContents={setWriteLetterContents}
          toName={petName}
        />
      </LetterWrapper>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: ${colors.white};
  padding: ${height * 0.02}px 0 0 0;
  align-items: center;
`;

const LetterWrapper = styled.View`
  width: 90%;
  height: 94%;
`;

export default WriteLetterScreen;
