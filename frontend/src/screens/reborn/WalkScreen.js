/* eslint-disable react-hooks/exhaustive-deps */
import React, {useRef, useState, useEffect, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {Dimensions} from 'react-native';
import styled from 'styled-components/native';
import colors from './../../constants/colors';
import {NpsBText} from '../../components/CustomText';
import {useReborn} from './../../context/RebornContext';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import ToastMessage from '../../components/ToastMessage';
import {startCounter, stopCounter} from 'react-native-accurate-step-counter';
import AnimalImages from '../../components/AnimalImages';

import {patch} from '../../services/api';
import config from '../../constants/config';

import WalkIcon from './../../assets/images/others/walk.svg';

const {width, height} = Dimensions.get('window');

const GOAL_COUNT = 10; // 300인데 test용으로 10해둔 것임

const WalkScreen = ({navigation}) => {
  const hasMounted = useRef(false);
  const {setIsWalk, farewellId, progress, petColor, petCase} = useReborn();

  const [walkCount, setWalkCount] = useState(1);
  const [walkPercent, setWalkPercent] = useState(0);
  const [showStartToast, setStartShowToast] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsWalk(false);
      setWalkCount(1);
      setWalkPercent(0);
      setStartShowToast(false);
    }, []),
  );

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      setStartShowToast(true);

      const timer = setTimeout(() => {
        setStartShowToast(false);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    setWalkPercent((walkCount / GOAL_COUNT) * 100);

    const updateWalkState = async () => {
      if (walkCount >= GOAL_COUNT) {
        // 목표 도달 시 만보기 멈추기
        stopCounter();

        try {
          await patch(
            config[progress.toUpperCase()].UPDATE(farewellId, 'walk'),
          );

          setIsWalk(true);
          navigation.navigate('RebornStackNavigator', {
            screen: 'RebornMainScreen',
          });
        } catch (err) {
          console.error('산책 완료 업데이트 실패:', err);
        }
      }
    };

    updateWalkState();
  }, [walkCount]);

  useEffect(() => {
    const pedometer_config = {
      default_threshold: 15.0,
      default_delay: 150000000,
      cheatInterval: 3000,
      onStepCountChange: stepCount => {
        if (walkCount < GOAL_COUNT) {
          setWalkCount(stepCount);
        }
      },
      onCheat: () => {
        console.log('User is Cheating');
      },
    };
    startCounter(pedometer_config);
    return () => {
      stopCounter();
    };
  }, []);

  const bgImage = require('./../../assets/images/backgrounds/bg_walk.png');
  const animalHeadImage = AnimalImages?.[petCase]?.[petColor]?.face;

  return (
    <Container>
      <BgImage source={bgImage}>
        {showStartToast && (
          <ToastMessage
            message="신선한 공기를 마시며 걷다 보면 기분이 나아질 거예요."
            onHide={() => setStartShowToast(false)}
          />
        )}
        <AnimalWrapper>
          <AnimalHead source={animalHeadImage} />
          <RegularText>목표 걸음 수: 300걸음</RegularText>
        </AnimalWrapper>
        <CircleWrapper>
          <AnimatedCircularProgress
            size={width * 0.8}
            width={15}
            fill={walkPercent}
            tintColor={colors.yellow}
            backgroundColor={colors.white}
          />
          <CircleTextWrapper>
            <WalkIconWrapper>
              <WalkIcon width={width * 0.08} height={width * 0.08} />
              <RegularText>산책하기</RegularText>
            </WalkIconWrapper>

            <WalkCountText>{walkCount}</WalkCountText>
          </CircleTextWrapper>
        </CircleWrapper>
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
  opacity: 0.86;
`;

const AnimalWrapper = styled.View`
  width: fit-content;
  height: fit-content;
  align-items: center;
  justify-content: center;
  gap: ${width * 0.02}px;
  margin-top: ${height * 0.03}px;
`;

const AnimalHead = styled.Image`
  width: ${width * 0.24}px;
  height: ${width * 0.24}px;
  resize-mode: contain;
`;

const RegularText = styled(NpsBText)`
  font-size: ${width * 0.045}px;
  color: ${colors.brown};
`;

const WalkCountText = styled(NpsBText)`
  font-size: ${width * 0.2}px;
  color: ${colors.brown};
`;

const CircleTextWrapper = styled.View`
  position: absolute;
  align-items: center;
  justify-content: center;
  width: ${width * 0.8}px;
  height: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-${(width * 0.8) / 2}px, -${(height * 0.5) / 2}px);
  gap: 8px;
`;

const WalkIconWrapper = styled.View`
  align-items: center;
  gap: 8px;
`;

const CircleWrapper = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  align-items: center;
  justify-content: center;
`;

export default WalkScreen;
