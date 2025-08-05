import React from 'react';
import styled from 'styled-components/native';
import ModalPetItem from '../item/ModalPetItem';

const PetModalList = ({ pets, onSelect }) => {
  return (
    <Container>
      {pets.map(pet => (
        <ModalPetItem
          key={pet.id}
          pet={pet}
          onSelect={onSelect}
        />
      ))}
    </Container>
  );
};

export default PetModalList;

const Container = styled.View`
  padding: 20px;
`;
