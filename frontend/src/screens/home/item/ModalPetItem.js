import React from 'react';
import styled from 'styled-components/native';
import colors from '../../../constants/colors';

import { Dimensions, TouchableOpacity } from 'react-native';

import RibbonBlackIcon from '../../../assets/images/others/ribbon_black.svg';

const { width, height } = Dimensions.get('window');

const ModalPetItem = ({ pet, onSelect }) => {
  return (
    <PetItem onPress={() => onSelect(pet)}>
      <PetImage source={pet.image} />
      <PetInfo>
        <PetName>{pet.name}</PetName>
        {pet.die && <RibbonBlackIcon width={width * 0.07} height={width * 0.07} />}
      </PetInfo>
    </PetItem>
  );
};

const PetItem = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  padding: ${height * 0.015}px;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.gray200};
`;

const PetImage = styled.Image`
  width: ${width * 0.15}px;
  height: ${height * 0.07}px;
  border-radius: 5px;
  margin-right: 15px;
`;

const PetInfo = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

const PetName = styled.Text`
  font-size: ${width * 0.05};
  font-family: 'NPSfont_bold';
  color: ${colors.brown};
`;

const RibbonImage = styled.Image`
  width: ${width * 0.05}px;
  height: ${width * 0.05}px;
`;


export default ModalPetItem;
