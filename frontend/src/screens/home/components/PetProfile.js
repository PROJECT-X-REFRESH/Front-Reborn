import React from 'react';
import styled from 'styled-components/native';
import { Dimensions, TouchableOpacity } from 'react-native';
import colors from '../../../constants/colors';
import RibbonBlackIcon from '../../../assets/images/others/ribbon_black.svg';

const { width } = Dimensions.get('window');

const PetProfile = ({ pet, onPress }) => {
  return (
    <ProfileContainer>
      <TouchableOpacity onPress={onPress}>
        <PetImage source={pet.image} />
      </TouchableOpacity>
      <PetInfo>
        <PetName>{pet.name}</PetName>
        <PetBirth>
          {pet.birth}
          {pet.die && (
            <RibbonBlackIcon width={width * 0.04} height={width * 0.04} />
          )}
        </PetBirth>
      </PetInfo>
    </ProfileContainer>
  );
};

export default PetProfile;

const ProfileContainer = styled.View`
  flex-direction: row;
  align-items: flex-end;
  margin-bottom: 20px;
`;

const PetImage = styled.Image`
  width: ${width * 0.25}px;
  height: ${width * 0.25}px;
  border-radius: 5px;
  margin-right: ${width * 0.05}px;
`;

const PetInfo = styled.View`
  flex: 1;
`;

const PetName = styled.Text`
  font-size: ${width * 0.06}px;
  font-family: 'NPSfont_bold';
  color: ${colors.brown};
`;

const PetBirth = styled.Text`
  font-size: ${width * 0.04}px;
  font-family: 'NPSfont_bold';
  color: ${colors.brown};
`;
