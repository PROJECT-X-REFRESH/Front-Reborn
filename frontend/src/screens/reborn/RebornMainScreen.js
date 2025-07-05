/* eslint-disable curly */
import React, {useState, useEffect} from 'react';
import {Dimensions} from 'react-native';
import styled from 'styled-components/native';
import {useReborn} from './../../context/RebornContext';
import colors from './../../constants/colors';
import ContentsBox from './../../components/ContentsBox';
import Animal from './Animal';

import {post, put} from '../../services/api';

import config from '../../constants/config';

const {width, height} = Dimensions.get('window');

const RebornMainScreen = ({navigation: {navigate}, route}) => {
  const {
    petColor,
    petCase,
    farewellId,
    fstep,
    setFstep,
    progress,
    setProgress,
    isContents1,
    isContents2,
    setIsAllClear,
    isTimeToNext,
  } = useReborn();

  const [iconName, setIconName] = useState(route.params?.iconName || 'survey');

  const bgImage = require('./../../assets/images/backgrounds/bg_blossom.png');

  return (
    <Container>
      <BgImage source={bgImage}>
        <Animal
          animalType={petCase}
          animalColor={petColor}
          animalAction="idle"
          onPress1={() =>
            navigate('RebornStackNavigator', {
              screen: 'DailyContentsScreen',
              params: {contents: 'feed'},
            })
          }
          onPress2={() =>
            navigate('RebornStackNavigator', {
              screen: 'WalkScreen',
            })
          }
          onPress3={() =>
            navigate('RebornStackNavigator', {
              screen: 'DailyContentsScreen',
              params: {contents: 'snack'},
            })
          }
        />

        {progress !== 'remember' ? (
          <ContentsBoxWrapper>
            {!isContents1 && (
              <ContentsBoxContainer
                progress={progress}
                iconName={iconName}
                setIconName={setIconName}
                setProgress={setProgress}
                setIsAllClear={setIsAllClear}
                navigate={navigate}
              />
            )}
            {isTimeToNext && (
              <ContentsBoxContainer
                progress={progress}
                iconName="nextDay"
                farewellId={farewellId}
                fstep={fstep}
                setFstep={setFstep}
                setIconName={setIconName}
                setProgress={setProgress}
                setIsAllClear={setIsAllClear}
                navigate={navigate}
              />
            )}
          </ContentsBoxWrapper>
        ) : (
          <ContentsBoxWrapper>
            {!isContents1 && (
              <ContentsBoxContainer
                progress={progress}
                iconName={'image'}
                setIconName={setIconName}
                setProgress={setProgress}
                setIsAllClear={setIsAllClear}
                navigate={navigate}
              />
            )}
            {!isContents2 && (
              <ContentsBoxContainer
                progress={progress}
                iconName={'arrange'}
                setIconName={setIconName}
                setProgress={setProgress}
                setIsAllClear={setIsAllClear}
                navigate={navigate}
              />
            )}
            {isTimeToNext && isContents1 && isContents2 && (
              <ContentsBoxContainer
                progress={progress}
                farewellId={farewellId}
                fstep={fstep}
                setFstep={setFstep}
                iconName="nextDay"
                setIconName={setIconName}
                setProgress={setProgress}
                setIsAllClear={setIsAllClear}
                navigate={navigate}
              />
            )}
          </ContentsBoxWrapper>
        )}
      </BgImage>
    </Container>
  );
};

const fetchProgressCreate = async (progress, farewellId) => {
  await post(config[progress.toUpperCase()].CREATE(farewellId));
};

const fetchFstepIncrease = async (farewellId, fstep, setFstep) => {
  const res = await put(config.FAREWELL.FSTEP_INCREASE(farewellId, fstep));
  setFstep(res.result);
};

const ContentsBoxContainer = ({
  progress,
  farewellId,
  fstep,
  setFstep,
  iconName,
  setIconName,
  setProgress,
  setIsAllClear,
  navigate,
}) => {
  // 1) progress가 바뀔 때 아이콘만 갱신 (렌더 단계 X)
  useEffect(() => {
    switch (progress) {
      case 'recognize':
        setIconName('survey');
        break;
      case 'reveal':
        setIconName('record');
        break;
      case 'remember':
        if (iconName !== 'image') setIconName('arrange');
        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress]);

  // 2) 순수 표시용 값 계산
  const isYellow = true;
  let contentsText = '';
  let iconText = '';
  let onPress = () => {};

  switch (progress) {
    case 'recognize':
      contentsText = 'COGNIZE: 나의 심리 상태 알아보기';
      iconText = '자가진단';
      onPress = () =>
        navigate('RebornStackNavigator', {screen: 'SurveyScreen'});
      break;

    case 'recognize_next':
      contentsText = 'COGNIZE: 다음날로 넘어가기';
      iconText = `DAY ${fstep}`;
      onPress = async () => {
        setProgress('reveal');
        setIsAllClear(true);
        await fetchFstepIncrease(farewellId, fstep, setFstep);
        await fetchProgressCreate(progress, farewellId);
      };
      break;

    case 'reveal':
      contentsText = 'VEAL: 나의 감정 드러내기';
      iconText = '감정일기';
      onPress = () =>
        navigate('RebornStackNavigator', {screen: 'EmotionDiaryScreen'});
      break;

    case 'reveal_next':
      contentsText = 'VEAL: 다음날로 넘어가기';
      iconText = `DAY ${fstep}`;
      onPress = async () => {
        setIsAllClear(true);
        await fetchFstepIncrease(farewellId, fstep, setFstep);
        if (fstep >= 4) {
          setProgress('remember');
          await fetchProgressCreate(progress, farewellId);
        } else {
          setProgress('reveal');
        }
      };
      break;

    case 'remember':
      if (iconName === 'image') {
        contentsText = 'MEMBER: 반려동물 추억 정리하기';
        iconText = '사진일기';
        onPress = () =>
          navigate('RebornStackNavigator', {screen: 'ImageDiaryScreen'});
      } else {
        contentsText = 'MEMBER: 반려동물 물품 정리하기';
        iconText = '정리하기';
        onPress = () =>
          navigate('RebornStackNavigator', {screen: 'ArrangeScreen'});
      }
      break;

    case 'remember_next':
      contentsText = 'MEMBER: 다음날로 넘어가기';
      iconText = `DAY ${fstep}`;
      onPress = async () => {
        setIsAllClear(true);
        await fetchFstepIncrease(farewellId, fstep, setFstep);
        if (fstep >= 6) {
          setProgress('wash');
          await fetchProgressCreate(progress, farewellId);
          navigate('RebornStackNavigator', {screen: 'RebirthScreen'});
        } else {
          setProgress('remember');
        }
      };
      break;
    default:
      break;
  }

  return (
    <ContentsBox
      iconText={iconText}
      contentsText={contentsText}
      iconName={iconName}
      isYellow={isYellow}
      onPress={onPress}
    />
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

const ContentsBoxWrapper = styled.View`
  flex: 1;
  align-items: center;
  position: absolute;
  margin-top: ${width * 0.075};
  gap: 16;
`;

export default RebornMainScreen;
