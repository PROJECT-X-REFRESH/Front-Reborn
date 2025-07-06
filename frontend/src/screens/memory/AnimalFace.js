import React from 'react';
import {Dimensions} from 'react-native';
import styled from 'styled-components/native';
import AnimalImages from '../../components/AnimalImages';

const {width, height} = Dimensions.get('window');

const AnimalFace = ({animalType, animalColor}) => {
  const AnimalSrc = AnimalImages?.[animalType]?.[animalColor]?.face;

  return (
    <Container>
      <AnimalContainer>
        <AnimalImage source={AnimalSrc} resizeMode="contain" />
      </AnimalContainer>
    </Container>
  );
};

const Container = styled.View`
  align-items: center;
  margin-bottom: ${height * 0.02}px;
`;

const AnimalContainer = styled.View`
  width: ${width * 0.3};
  height: ${height * 0.1};
  align-items: center;
`;

const AnimalImage = styled.Image`
  width: 100%;
  height: 100%;
`;

export default AnimalFace;
