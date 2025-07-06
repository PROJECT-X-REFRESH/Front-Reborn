import React from 'react';
import {Dimensions} from 'react-native';
import styled from 'styled-components/native';
import AnimalImages from '../../components/AnimalImages';

const {width, height} = Dimensions.get('window');

const AnimalIdle = ({animalType, animalColor}) => {
  const AnimalSrc = AnimalImages?.[animalType]?.[animalColor]?.idle;

  return (
    <Container>
      <AnimalContainer>
        <AnimalImage source={AnimalSrc} resizeMode="contain" />
      </AnimalContainer>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  justify-content: flex-end;
  align-items: center;
`;

const AnimalContainer = styled.View`
  position: relative;
  bottom: ${height * 0.1};
  width: ${width * 0.5};
  height: ${height * 0.25};
  align-items: center;
  justify-content: center;
`;

const AnimalImage = styled.Image`
  width: 100%;
  height: 100%;
`;

export default AnimalIdle;
