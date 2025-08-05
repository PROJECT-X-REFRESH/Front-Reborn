import React from 'react';
import styled from 'styled-components/native';
import { Dimensions } from 'react-native';
import colors from '../../../constants/colors';
import MemoryBox from '../item/MemoryBox';
import FarewellBox from '../item/FarewallBox';
import { NpsText } from '../../../components/CustomText';

const { width, height } = Dimensions.get('window');

const PetActivitySection = ({ die, selectedPet, rebornScreen, navigation }) => {
  return (
    <Section>
      <SectionTitle>
        <HighlightText>RE</HighlightText>BORN {die === null ? '추억쌓기' : '작별하기'}
      </SectionTitle>

      {die === null ? (
        <MemoryBox
          remindActive={selectedPet?.todayRemind ?? false}
          recordActive={selectedPet?.todayRecord ?? false}
          onPress={() =>
            navigation.navigate('MemoryStackNavigator', {
              screen: 'MemoryMainScreen',
              params: {
                petId: selectedPet?.id,
                petCase: selectedPet?.petCase,
                color: selectedPet?.color,
              },
            })
          }
        />
      ) : (
        <FarewellBox
          fstep={selectedPet?.fstep ?? 0}
          onPress={() => {
            navigation.navigate('RebornStackNavigator', { screen: rebornScreen });
          }}
        />
      )}
    </Section>
  );
};

export default PetActivitySection;

const Section = styled.View`
  margin-bottom: ${height * 0.03}px;
`;

const SectionTitle = styled(NpsText)`
  font-size: ${width * 0.045}px;
  font-family: 'NPSfont_extrabold';
  color: ${colors.brown};
  margin-top: ${height * 0.015}px;
  margin-bottom: ${height * 0.015}px;
`;

const HighlightText = styled(NpsText)`
  color: ${colors.yellow};
  font-family: 'NPSfont_extrabold';
`;
