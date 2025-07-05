/* eslint-disable curly */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useRef, useEffect, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {Animated, PanResponder, Dimensions} from 'react-native';
import styled from 'styled-components/native';
import {useReborn} from './../../context/RebornContext';
import colors from './../../constants/colors';
import Animal from './Animal';

import {patch} from '../../services/api';
import config from '../../constants/config';

const {width, height} = Dimensions.get('window');

const DailyContentsScreen = ({navigation, route}) => {
  const contents = route.params?.contents || 'feed';

  const {
    isFeed,
    setIsFeed,
    isSnack,
    setIsSnack,
    farewellId,
    progress,
    petColor,
    petCase,
  } = useReborn();

  const [animalAction, setAnimalAction] = useState('idle');

  const feedImage = require('./../../assets/images/pets/others/feed.png');

  const snackImage_dog = require('./../../assets/images/pets/dog/others/dog_snack.png');
  const snackImage_cat = require('./../../assets/images/pets/cat/others/cat_snack.png');
  const snackIcon = petCase === 'CAT' ? snackImage_cat : snackImage_dog;

  const bowlImage_dog = require('./../../assets/images/pets/dog/others/dog_bowl.png');
  const bowlImage_cat = require('./../../assets/images/pets/cat/others/cat_bowl.png');
  const bowlIcon = petCase === 'CAT' ? bowlImage_cat : bowlImage_dog;

  const emptyBowlImage_dog = require('./../../assets/images/pets/dog/others/dog_bowl_no.png');
  const emptyBowlImage_cat = require('./../../assets/images/pets/cat/others/cat_bowl_no.png');
  const emptyBowlIcon =
    petCase === 'CAT' ? emptyBowlImage_cat : emptyBowlImage_dog;

  const bgImage = require('./../../assets/images/backgrounds/bg_living1.png');

  const bowlLayout = useRef(null);
  const animalLayout = useRef(null);
  const feedPan = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;

  useFocusEffect(
    useCallback(() => {
      if (contents === 'feed') {
        setIsFeed(false);
      } else if (contents === 'snack') {
        setIsSnack(false);
      }
    }, []),
  );

  const startAnimation = type => {
    let count = 0;
    const interval = setInterval(async () => {
      setAnimalAction(prev => (prev === `${type}1` ? `${type}2` : `${type}1`));
      count++;
      if (count >= 10) {
        /* 미션 성공 */
        clearInterval(interval);
        setAnimalAction('idle');
        await patch(
          config[progress.toUpperCase()].UPDATE(farewellId, contents),
        );
        navigation.navigate('RebornStackNavigator', {
          screen: 'RebornMainScreen',
        });
      }
    }, 500);
  };

  useEffect(() => {
    if (contents === 'feed' && isFeed) startAnimation('feed');
  }, [isFeed]);

  useEffect(() => {
    if (contents === 'snack' && isSnack) startAnimation('snack');
  }, [isSnack]);

  // 스케일 및 이동 복귀 애니메이션
  const onPressIn = Animated.spring(scale, {
    toValue: 0.9,
    useNativeDriver: true,
  });

  const onPressOut = Animated.spring(scale, {
    toValue: 1,
    useNativeDriver: true,
  });

  const goHome = Animated.spring(feedPan, {
    toValue: {x: 0, y: 0},
    useNativeDriver: true,
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        onPressIn.start();
      },
      onPanResponderMove: (_, {dx, dy, moveX, moveY}) => {
        feedPan.setValue({x: dx, y: dy});
      },
      onPanResponderRelease: (_, gestureState) => {
        let x, y, boxW, boxH;

        if (contents === 'feed') {
          const layout = bowlLayout.current;
          if (!layout) return;
          ({x, y, width: boxW, height: boxH} = layout);
        } else {
          const layout = animalLayout.current;
          if (!layout) return;
          ({x, y, width: boxW, height: boxH} = layout);
        }

        const dropX = gestureState.moveX;
        const dropY = gestureState.moveY;

        const isOver =
          dropX >= x && dropX <= x + boxW && dropY >= y && dropY <= y + boxH;

        if (contents === 'feed') {
          setIsFeed(isOver);
        } else {
          setIsSnack(isOver);
        }

        onPressOut.start(() => {
          goHome.start();
        });
      },
    }),
  ).current;

  return (
    <Container>
      <BgImage source={bgImage}>
        <AnimalContainer
          onLayout={e => {
            animalLayout.current = e.nativeEvent.layout;
          }}>
          <Animal
            animalType={petCase}
            animalColor={petColor}
            animalAction={animalAction}
            whatContents="none"
          />
        </AnimalContainer>

        {contents === 'feed' && (
          <>
            <BowlTouchArea
              onLayout={e => {
                bowlLayout.current = e.nativeEvent.layout;
              }}>
              {isFeed ? (
                <BowlImage source={bowlIcon} />
              ) : (
                <BowlImage source={emptyBowlIcon} />
              )}
            </BowlTouchArea>

            {!isFeed && (
              <Animated.View
                style={{
                  position: 'absolute',
                  top: height * 0.1,
                  right: width * 0.1,
                  transform: [...feedPan.getTranslateTransform(), {scale}],
                }}
                {...panResponder.panHandlers}>
                <FeedImage source={feedImage} />
              </Animated.View>
            )}
          </>
        )}

        {contents === 'snack' && (
          <>
            {!isSnack && (
              <Animated.View
                style={{
                  position: 'absolute',
                  top: height * 0.1,
                  right: width * 0.1,
                  transform: [...feedPan.getTranslateTransform(), {scale}],
                }}
                {...panResponder.panHandlers}>
                <FeedImage source={snackIcon} />
              </Animated.View>
            )}
          </>
        )}
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

const FeedImage = styled.Image`
  width: ${width * 0.25}px;
  height: ${width * 0.25}px;
  z-index: 99;
`;

const BowlTouchArea = styled.View`
  width: fit-content;
  height: ${width * 0.4}px;
  justify-content: flex-end;
  position: absolute;
  bottom: ${height * 0.05}px;
  left: ${width * 0.15}px;
`;

const BowlImage = styled.Image`
  width: ${width * 0.25}px;
  height: ${width * 0.25}px;
`;

export default DailyContentsScreen;
