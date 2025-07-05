/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState, useCallback} from 'react';
import {
  Animated,
  PanResponder,
  Dimensions,
  findNodeHandle,
  UIManager,
  Modal,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import styled from 'styled-components/native';
import colors from './../../constants/colors';
import Animal from './Animal';
import {useReborn} from './../../context/RebornContext';
import ToastMessage from './../../components/ToastMessage';
import ContentsBox from './../../components/ContentsBox';
import Letter from './../../components/Letter';

import {patch, post} from '../../services/api';
import config from '../../constants/config';

const {width, height} = Dimensions.get('window');

const RebirthScreen = ({navigation, route}) => {
  const {
    progress,
    setProgress,
    farewellId,
    petName,
    petCase,
    petColor,
    chooseRibbon,
    setChooseRibbon,
  } = useReborn();

  const [animalContents, setAnimalContents] = useState('wash');
  const [animalAction, setAnimalAction] = useState('dirty');

  const [isClothes, setIsClothes] = useState(false);

  const [showRibbonToast, setShowRibbonToast] = useState(false); // 리본 선택 토스트
  const [showLetterToast, setShowLetterToast] = useState(false); // 편지쓰기 완료 토스트
  const [receiveLetterContents, setReceiveLetterContents] = useState(''); // 편지받기 내용 from AI
  const [userName, setUserName] = useState(''); // 유저 이름(편지에 들어갈)
  const [showReceiveLetter, setShowReceiveLetter] = useState(false); // 편지받기 모달
  const [isLetterEnd, setIsLetterEnd] = useState(false); // 편지쓰기 완료 여부

  const animalRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      const newContents = route.params?.contents;

      if (newContents) {
        setIsLetterEnd(true);
        setShowLetterToast(true);
        fetchLetterAI(newContents);
      }
    }, [route.params?.contents]),
  );

  const fetchLetterAI = async contents => {
    try {
      const payload = {
        f_id: farewellId,
        content: contents,
      };

      const response = await post(config.AI.REBIRTH_MESSAGE, payload);
      setReceiveLetterContents(response.result[0]);
      setUserName(response.result[1]);
      setShowReceiveLetter(true);
    } catch (e) {
      console.error('편지 실패2:', e);
    }
  };

  useEffect(() => {
    switch (progress) {
      case 'wash':
        setAnimalContents('wash');
        setAnimalAction('dirty');
        break;
      case 'clothes':
        setAnimalContents('none');
        setAnimalAction('idle');
        break;
      case 'ribbon':
        setAnimalContents('ribbon');
        setAnimalAction('clothes');
        setIsClothes(true);
        setTimeout(() => setShowRibbonToast(true), 300);
        break;
      case 'letter':
        setAnimalContents('none');
        setAnimalAction(chooseRibbon);
        break;
      case 'outro':
        navigation.navigate('RebornStackNavigator', {
          screen: 'IntroOutroScreen',
        });
        break;
    }
  }, [progress, navigation, chooseRibbon]);

  const bgImage = require('./../../assets/images/backgrounds/bg_living3.png');
  const clothesImage = require('./../../assets/images/pets/others/clothes.png');

  /* 샤워하기 -> 옷 입히기 -> 리본 달기 -> 편지 쓰기 -> 편지 받기 -> 아웃트로 */
  return (
    <Container>
      <BgImage source={bgImage}>
        {showRibbonToast && (
          <ToastMessage
            message="달아줄 리본을 선택해주세요"
            onHide={() => setShowRibbonToast(false)}
          />
        )}
        {showLetterToast && (
          <ToastMessage
            message="편지가 도착했어요!"
            onHide={() => setShowLetterToast(false)}
          />
        )}

        {progress === 'letter' && !isLetterEnd && (
          <ContentsBoxWrapper>
            <ContentsBox
              iconText="편지쓰기"
              contentsText="BIRTH: 반려동물과 건강한 작별하기"
              iconName="letter"
              isYellow={true}
              onPress={() => {
                navigation.navigate('RebornStackNavigator', {
                  screen: 'WriteLetterScreen',
                });
              }}
            />
          </ContentsBoxWrapper>
        )}

        {showReceiveLetter && (
          <Modal
            statusBarTranslucent={true}
            animationType="slide"
            visible={showReceiveLetter}
            transparent={true}>
            <BlackContainer
              onPress={() => {
                fetchFarewellProgress(farewellId, 'outro');
                setProgress('outro');
              }}>
              <LetterWrapper>
                <Letter
                  contents={receiveLetterContents}
                  toName={userName}
                  fromName={petName}
                />
              </LetterWrapper>
            </BlackContainer>
          </Modal>
        )}

        <AnimalContainer ref={animalRef}>
          <Animal
            animalType={petCase}
            animalColor={petColor}
            animalAction={animalAction}
            onPress1={() => {
              setChooseRibbon('YELLOW');
              fetchFarewellProgress(farewellId, 'yribbon');
              setTimeout(() => setAnimalAction('YELLOW'), 300);
              setProgress('letter');
            }}
            onPress2={() => {
              setChooseRibbon('BLACK');
              fetchFarewellProgress(farewellId, 'bribbon');
              setTimeout(() => setAnimalAction('BLACK'), 300);
              setProgress('letter');
            }}
            onPress3={() => {
              navigation.navigate('RebornStackNavigator', {
                screen: 'WashScreen',
              });
            }}
            whatContents={animalContents}
          />
        </AnimalContainer>

        {progress === 'clothes' && !isClothes && (
          <DraggableImage
            source={clothesImage}
            animalRef={animalRef}
            setProgress={setProgress}
            farewellId={farewellId}
          />
        )}
      </BgImage>
    </Container>
  );
};

const fetchFarewellProgress = async (farewellId, activityType) => {
  try {
    await patch(config.REBIRTH.UPDATE_STATUS(farewellId, activityType));
  } catch (err) {
    console.error('옷 입히기 상태 업데이트 실패:', err);
  }
};

const DraggableImage = ({source, animalRef, setProgress, farewellId}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const position = useRef(new Animated.ValueXY({x: 0, y: 0})).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        Animated.spring(scale, {
          toValue: 0.9,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderMove: (_, {dx, dy}) => {
        position.setValue({x: dx, y: dy});
      },
      onPanResponderRelease: (_, {moveX, moveY}) => {
        if (animalRef.current) {
          const handle = findNodeHandle(animalRef.current);
          UIManager.measureInWindow(handle, (x, y, width, height) => {
            if (
              moveX >= x &&
              moveX <= x + width &&
              moveY >= y &&
              moveY <= y + height
            ) {
              // 옷입히기 성공
              fetchFarewellProgress(farewellId, 'clothes');
              setProgress('ribbon');
            }
          });
        }

        Animated.parallel([
          Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
          }),
          Animated.spring(position, {
            toValue: {x: 0, y: 0},
            useNativeDriver: true,
          }),
        ]).start();
      },
    }),
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={{
        position: 'absolute',
        top: 80,
        right: 40,
        transform: [...position.getTranslateTransform(), {scale}],
      }}
      resizeMode="contain">
      <ItemImage source={source} />
    </Animated.View>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: ${colors.white};
  padding: ${height * 0.02}px 0 0 0;
`;

const BgImage = styled.ImageBackground`
  flex: 1;
  width: 100%;
  height: 100%;
  align-items: center;
`;

const AnimalContainer = styled.View`
  width: fit-content;
  height: ${height * 0.35}px;
  position: absolute;
  bottom: 0px;
`;

const ItemImage = styled.Image`
  width: ${width * 0.24}px;
  height: ${width * 0.24}px;
`;

const ContentsBoxWrapper = styled.View`
  flex: 1;
  align-items: center;
  position: absolute;
  margin-top: ${width * 0.075};
  gap: 16;
`;

const LetterWrapper = styled.View`
  width: ${width * 0.86}px;
  height: 84%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-${(width * 0.86) / 2}px, -${(height * 0.84) / 2}px);
`;

const BlackContainer = styled.Pressable`
  background-color: rgba(0, 0, 0, 0.25);
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export default RebirthScreen;
