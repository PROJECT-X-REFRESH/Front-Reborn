/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useRef,
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import { useFocusEffect } from '@react-navigation/native';
import styled from 'styled-components/native';
import { Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { NpsText } from '../../components/CustomText';
import colors from '../../constants/colors';
import BotIcon from '../../assets/images/others/chatbot.svg';
import { useReborn } from './../../context/RebornContext';
import { PetContext } from '../../context/PetContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReturnPostItem from './item/ReturnPostItem';
import MemoryBox from './item/MemoryBox';
import FarewallBox from './item/FarewallBox';
import ModalPetItem from './item/ModalPetItem';
import RibbonBlackIcon from '../../assets/images/others/ribbon_black.svg';
import { ProfileImages } from './ProfileImages';

import { get } from '../../services/api';
import config from '../../constants/config';
import * as Keychain from 'react-native-keychain';

const { width, height } = Dimensions.get('window');

const SELECTED_PET_KEY = 'selectedPetId';

const HomeScreen = ({ navigation }) => {
  const modalRef = useRef(null);
  const [userName, setUserName] = useState('');
  const [selectedPet, setSelectedPet] = useState(null);
  const [pets, setPets] = useState([]);
  const [posts, setPosts] = useState([]);
  const [die, setDie] = useState(null);
  const [rebornScreen, setRebornScreen] = useState('IntroOutroScreen');

  const { setPetId } = useContext(PetContext);

  const {
    setPetColor,
    setPetCase,
    setFstep,
    setProgress,
    setFarewellId,
    setPetName,
    setIsWalk,
    setIsFeed,
    setIsSnack,
    setIsContents1,
    setIsContents2,
    ResetRebornContext,
    setChooseRibbon,
  } = useReborn();

  useFocusEffect(
    useCallback(() => {
      const fetchMain = async () => {
        try {
          const res = await get(config.USERS.MAIN);
          const petList = res.result.petList || [];

          const formattedPets = petList.map(pet => ({
            id: pet.id,
            name: pet.name,
            fstep: pet.fstep,
            farewellId: pet.farewellId,
            petCase: pet.petCase,
            birth: pet.birth,
            die: !!pet.death,
            color: pet.color,
            todayRemind: pet.todayRemind,
            todayRecord: pet.todayRecord,
            image: ProfileImages[pet.petCase]?.[pet.color],
          }));

          setUserName(res.result.name);
          setPets(formattedPets);
          setPosts(res.result.aiPost || []);

          const storedPetId = await loadSelectedPetId();
          const currentPet =
            formattedPets.find(p => p.id === storedPetId) ?? formattedPets[0];

          if (currentPet) {
            setSelectedPet(currentPet);
            saveSelectedPetId(currentPet.id);
          }
        } catch (e) {
          console.error('메인 화면 데이터 불러오기 실패:', e);
        }
      };

      fetchMain();
    }, []),
  );

  useEffect(() => {
    if (selectedPet) {
      ResetRebornContext();

      setPetId(selectedPet.id);
      setPetCase(selectedPet.petCase);
      setPetColor(selectedPet.color);
      setPetName(selectedPet.name);
      setFstep(selectedPet.fstep);
      setFarewellId(selectedPet.farewellId);
      setProgressByfstep(selectedPet.fstep, selectedPet.farewellId);
      setDie(selectedPet.die ? 3 : null);
    }
  }, [selectedPet]);

  const profileImg = selectedPet?.image;

  const fetchFarewellProgress = async (progress, _farewellId) => {
    try {
      const accessData = await Keychain.getGenericPassword();
      const tokenObj = JSON.parse(accessData?.password);
      const accessToken = tokenObj.accessToken;

      const res = await get(
        config[progress].VIEW(_farewellId),
        {},
        {
          headers: {
            Authorization: `${accessToken}`,
          },
        },
      );

      if (res?.isSuccess && res?.result && progress === 'REBIRTH') {
        setProgress(res.result.nextStep);
        if (res.result.nextStep === 'letter') {
          setChooseRibbon(res.result.ribbon);
        }
        return;
      }

      if (res?.isSuccess && res?.result) {
        setIsFeed(res.result.feed);
        setIsWalk(res.result.walk);
        setIsSnack(res.result.snack);
        setIsContents1(res.result.contents1);
        setIsContents2(res.result.contents2);
      } else {
        console.warn('작별하기 진행상황 요청 실패:', res?.message);
      }
    } catch (error) {
      console.error('작별하기 진행상황 요청 에러:', String(error));
    }
  };
  const saveSelectedPetId = async id => {
    try {
      await AsyncStorage.setItem(SELECTED_PET_KEY, String(id));
    } catch (e) {
      console.error('선택된 pet 저장 실패:', e);
    }
  };

  const loadSelectedPetId = async () => {
    try {
      const id = await AsyncStorage.getItem(SELECTED_PET_KEY);
      return id ? parseInt(id, 10) : null;
    } catch (e) {
      console.error('선택된 pet 불러오기 실패:', e);
      return null;
    }
  };
  /* 작별하기 -> fstep에 따라 진행상황 progess 설정 */
  const setProgressByfstep = (_fstep, _farewellId) => {
    let _progress = 'intro';

    switch (_fstep) {
      case 0:
        _progress = 'intro';
        break;
      case 1:
        _progress = 'recognize';
        break;
      case 2:
      case 3:
      case 4:
        _progress = 'reveal';
        break;
      case 5:
      case 6:
        _progress = 'remember';
        break;
      case 7:
        _progress = 'rebirth';
        break;
      default:
        _progress = 'end';
        break;
    }

    setProgress(_progress);
    if (_fstep && (_fstep === 0 || _fstep === 8)) {
      setRebornScreen('IntroOutroScreen');
    } else if (_fstep && _fstep === 7 && _farewellId !== 0) {
      setRebornScreen('RebirthScreen');
      fetchFarewellProgress(_progress.toUpperCase(), _farewellId);
    } else if (_fstep < 7 && _fstep > 0 && _farewellId !== 0) {
      setRebornScreen('RebornMainScreen');
      fetchFarewellProgress(_progress.toUpperCase(), _farewellId);
    }
  };

  return (
    <Container>
      <Header>
        {selectedPet && (
          <PetProfile key={selectedPet.id}>
            <TouchableOpacity onPress={() => modalRef.current?.open()}>
              <PetImage source={selectedPet.image} />
            </TouchableOpacity>
            <PetInfo>
              <PetName>{selectedPet.name}</PetName>
              <PetBirth>
                {selectedPet.birth}
                {selectedPet.die && (
                  <RibbonBlackIcon width={width * 0.04} height={width * 0.04} />
                )}
              </PetBirth>
            </PetInfo>
          </PetProfile>
        )}

      </Header>

      <Section>
        <SectionTitle>
          <HighlightText>RE</HighlightText>BORN{' '}
          {die === null ? '추억쌓기' : '작별하기'}
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
          <FarewallBox
            fstep={selectedPet?.fstep ?? 0}
            onPress={() => {
              navigation.navigate('RebornStackNavigator', {
                screen: rebornScreen,
              });
            }}
          />
        )}
      </Section>

      <Section>
        <SectionTitle>
          오늘의 <HighlightText>RE</HighlightText>TURN 포스트
        </SectionTitle>
        <PostList
          data={posts}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <ReturnPostItem post={item} navigation={navigation} />
          )}
        />
      </Section>

      <Modalize
        ref={modalRef}
        snapPoint={height * 0.4}
        scrollViewProps={{ showsVerticalScrollIndicator: false }}>
        <PetListContainer>
          {pets.map(pet => (
            <ModalPetItem
              key={pet.id}
              pet={pet}
              onSelect={selected => {
                setSelectedPet({ ...selected });
                saveSelectedPetId(selected.id);
                modalRef.current?.close();
              }}
            />
          ))}
        </PetListContainer>
      </Modalize>
      <ChatbotButton
        onPress={() =>
          navigation.navigate('ReturnChatNavigator', {
            screen: 'ReturnChatScreen',
            params: { userName: userName },
          })
        }>
        <BotIcon width={24} height={24} />
      </ChatbotButton>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: ${colors.white};
  padding: ${height * 0.07}px ${width * 0.06}px;
`;

const Header = styled.View`
  align-items: center;
  margin-bottom: ${height * 0.03}px;
`;

const PetProfile = styled.View`
  flex-direction: row;
  align-items: flex-end;
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

const PostList = styled(FlatList)``;

const PetListContainer = styled.View`
  padding: 20px;
`;

const AddPetProfile = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin: ${height * 0.02}px ${width * 0.05}px;
`;

const ChatbotButton = styled.TouchableOpacity`
  position: absolute;
  bottom: ${height * 0.03}px;
  right: ${width * 0.06}px;
  background-color: ${colors.brown};
  width: ${width * 0.14}px;
  height: ${width * 0.14}px;
  border-radius: ${width * 0.07}px;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

export default HomeScreen;
