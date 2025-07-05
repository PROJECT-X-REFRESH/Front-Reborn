import React, {useRef, useState, useEffect} from 'react';
import {Dimensions, Animated, PanResponder} from 'react-native';
import styled from 'styled-components/native';
import colors from './../../constants/colors';
import Animal from './Animal';
import {useReborn} from './../../context/RebornContext';

import {patch} from '../../services/api';
import config from '../../constants/config';

const {width, height} = Dimensions.get('window');

const WashScreen = ({navigation}) => {
  const {setProgress, farewellId, petCase, petColor} = useReborn();

  const bgImage = require('./../../assets/images/backgrounds/bg_bath.png');
  const washImage = require('./../../assets/images/pets/others/showerhead.png');
  const waterImage = require('./../../assets/images/pets/others/shower_stream.png');

  const [showerIndex, setShowerIndex] = useState(0); // 샤워기 애니메이션 인덱스
  const [showShower, setShowShower] = useState(false); // 샤워기 애니메이션 보이기
  const [isDragging, setIsDragging] = useState(false); // 샤워기 드래그 중(물 붙이기)
  const [isOverDog, setIsOverDog] = useState(false); // 샤워기&강아지 충돌
  const [washCount, setWashCount] = useState(0); // 샤워기 애니메이션 카운트

  const dogLayout = useRef(null);

  const scale = useRef(new Animated.Value(1)).current;
  const position = useRef(new Animated.ValueXY({x: 0, y: 0})).current;

  // 샤워기&강아지 충돌 감지
  const checkIfOverDog = (x, y) => {
    const layout = dogLayout.current;
    if (!layout) return false;

    const showerWidth = width * 0.25;
    const showerHeight = width * 0.25;
    const showerCenterX = x + showerWidth / 2;
    const showerCenterY = y + showerHeight;

    return (
      showerCenterX > layout.x &&
      showerCenterX < layout.x + layout.width &&
      showerCenterY > layout.y &&
      showerCenterY < layout.y + layout.height
    );
  };

  const handleOverDog = isOver => {
    if (isOver) {
      setShowerIndex(0);
    } else {
      setShowerIndex(1);
    }
  };

  const onPressIn = Animated.spring(scale, {
    toValue: 0.9,
    useNativeDriver: true,
  });

  const onPressOut = Animated.spring(scale, {
    toValue: 1,
    useNativeDriver: true,
  });

  const goHome = Animated.spring(position, {
    toValue: {x: 0, y: 0},
    useNativeDriver: true,
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsDragging(true);
        onPressIn.start();
      },
      onPanResponderMove: (_, {dx, dy, moveX, moveY}) => {
        position.setValue({x: dx, y: dy});

        const currentX = dx + width * 0.1;
        const currentY = dy + height * 0.1;
        const isOver = checkIfOverDog(currentX, currentY);
        setIsOverDog(isOver);
        handleOverDog(isOver);
      },
      onPanResponderRelease: () => {
        setIsDragging(false);
        setIsOverDog(false);
        onPressOut.start(() => {
          goHome.start();
        });
      },
    }),
  ).current;

  // 애니메이션 상태 변화
  useEffect(() => {
    let interval;

    if (isDragging && isOverDog) {
      setShowShower(true);
      interval = setInterval(() => {
        setShowerIndex(prev => (prev === 0 ? 1 : 0));
        setWashCount(prev => prev + 1);
      }, 350);
    } else {
      setShowShower(false);
    }

    return () => clearInterval(interval);
  }, [isDragging, isOverDog, washCount]);

  // 강아지 씻기 완료 후 화면 이동
  useEffect(() => {
    if (washCount < 5) return;

    const completeWash = async () => {
      try {
        setProgress('clothes');
        await patch(config.REBIRTH.UPDATE_STATUS(farewellId, 'wash'));
        navigation.navigate('RebornStackNavigator', {screen: 'RebirthScreen'});
      } catch (err) {
        console.error('샤워 완료 상태 업데이트 실패:', err);
      }
    };

    completeWash();
  }, [washCount, navigation, setProgress, farewellId]);

  return (
    <Container>
      <BgImage source={bgImage}>
        <AnimalContainer
          onLayout={e => {
            dogLayout.current = e.nativeEvent.layout;
          }}>
          {/* dirty 상태 */}
          {!showShower && (
            <Animal
              animalType={petCase}
              animalColor={petColor}
              animalAction="dirty"
              whatContents="none"
            />
          )}

          {/* shower 상태 */}
          {showShower && showerIndex === 0 && (
            <Animal
              animalType={petCase}
              animalColor={petColor}
              animalAction="shower1"
              whatContents="none"
            />
          )}
          {showShower && showerIndex === 1 && (
            <Animal
              animalType={petCase}
              animalColor={petColor}
              animalAction="shower2"
              whatContents="none"
            />
          )}
        </AnimalContainer>

        <Animated.View
          style={{
            position: 'absolute',
            top: height * 0.1,
            left: width * 0.1,
            transform: [...position.getTranslateTransform(), {scale}],
          }}
          {...panResponder.panHandlers}>
          <ShowerImage source={washImage} />
          {isDragging && <WaterImage source={waterImage} />}
        </Animated.View>
      </BgImage>
    </Container>
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

const ShowerImage = styled.Image`
  width: ${width * 0.25}px;
  height: ${width * 0.25}px;
`;

const WaterImage = styled.Image`
  width: ${width * 0.25}px;
  height: ${width * 0.25}px;
  position: absolute;
  top: ${width * 0.04}px;
`;

export default WashScreen;
