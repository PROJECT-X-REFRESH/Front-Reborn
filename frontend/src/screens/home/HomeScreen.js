import React, {useRef, useContext} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import styled from 'styled-components/native';
import {Dimensions} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {PetContext} from '../../context/PetContext';
import {useReborn} from './../../context/RebornContext';
import useHomeData from './hooks/useHomeData';
import PetProfile from './components/PetProfile';
import PetActivitySection from './components/PetActivitySection';
import ReturnPostList from './components/ReturnPostList';
import PetModalList from './components/PetModalList';
import ChatbotButton from './components/ChatbotButton';
import colors from '../../constants/colors';

const {width, height} = Dimensions.get('window');

const HomeScreen = ({navigation}) => {
  const modalRef = useRef(null);

  // 각 컨텍스트에서 필요한 함수 가져오기
  const {setPetId} = useContext(PetContext);
  const rebornFns = useReborn();

  const {state, setState, fetchMain, saveSelectedPetId} = useHomeData();

  // 화면 포커스 시 데이터 로딩
  useFocusEffect(
    React.useCallback(() => {
      fetchMain(rebornFns, setPetId);
    }, [setPetId, fetchMain]),
  );

  return (
    <Container>
      {state.selectedPet && (
        <PetProfile
          pet={state.selectedPet}
          onPress={() => modalRef.current?.open()}
        />
      )}

      <PetActivitySection
        die={state.die}
        selectedPet={state.selectedPet}
        rebornScreen={state.rebornScreen}
        navigation={navigation}
      />

      <ReturnPostList posts={state.posts} navigation={navigation} />

      <Modalize ref={modalRef} snapPoint={height * 0.4}>
        <PetModalList
          pets={state.pets}
          onSelect={pet => {
            setState(prev => ({...prev, selectedPet: pet}));
            saveSelectedPetId(pet.id);
            modalRef.current?.close();
          }}
        />
      </Modalize>

      <ChatbotButton navigation={navigation} userName={state.userName} />
    </Container>
  );
};

export default HomeScreen;

const Container = styled.View`
  flex: 1;
  background-color: ${colors.white};
  padding: ${height * 0.07}px ${width * 0.06}px;
`;
