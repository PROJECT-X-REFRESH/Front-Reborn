import React from 'react';
import styled from 'styled-components/native';
import colors from '../../../constants/colors';

import {NpsText} from '../../../components/CustomText';
import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

const MemoryButton = ({icon, label, active, onPress}) => {
  return (
    <ButtonWrapper>
      <ButtonContainer active={active} onPress={onPress}>
        {icon}
      </ButtonContainer>
      <ButtonLabel>{label}</ButtonLabel>
    </ButtonWrapper>
  );
};

export default MemoryButton;

const ButtonWrapper = styled.View`
  align-items: center;
`;

const ButtonContainer = styled.View`
  align-items: center;
  justify-content: center;
  padding: 10px;
  width: ${width * 0.12}px;
  height: ${width * 0.12}px;
  margin: 0 15px;
  border-radius: 10px;
  background-color: ${({active}) => (active ? colors.yellow : colors.gray200)};

`;

const ButtonLabel = styled.Text`
  margin-top: ${height * 0.007}px;
  font-size: 10px;
  font-family: 'NPSfont_bold';
  color: ${colors.brown};
`;
