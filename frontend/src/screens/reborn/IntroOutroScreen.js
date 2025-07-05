import React, {useState} from 'react';
import {Dimensions} from 'react-native';
import styled from 'styled-components/native';
import colors from './../../constants/colors';
import {useReborn} from './../../context/RebornContext';

import {put, post} from '../../services/api';
import config from '../../constants/config';

const {width, height} = Dimensions.get('window');

/* petName 한글 체크 */
const getSubjectParticle = word => {
  const lastChar = word[word.length - 1];
  const code = lastChar.charCodeAt(0);

  const isHangul = code >= 0xac00 && code <= 0xd7a3;
  if (!isHangul) return '';

  const hasBatchim = (code - 0xac00) % 28 !== 0;
  return hasBatchim ? '이' : '';
};

const IntroOutroScreen = ({navigation}) => {
  const {progress, setProgress, farewellId, petName, fstep, setFstep} =
    useReborn();

  const [isIntro] = useState(progress === 'intro');

  const bgImage = isIntro
    ? require('./../../assets/images/backgrounds/bg_blossom.png')
    : require('./../../assets/images/backgrounds/bg_outro.png');

  const introTextArray = [
    `${petName}${getSubjectParticle(
      petName,
    )}가 친구들을 만나러 가기 전 당신을 찾아왔습니다.

    7일 동안 ${petName}${getSubjectParticle(
      petName,
    )}와 충분한 추억을 쌓고 건강한 작별 인사를 나누어 주세요.`,
  ];
  const outroTextArray = [
    `천국의 저쪽 편에는 '무지개 다리' 라는 곳이 있답니다. 
    
    지상에서 사람과 가깝게 지내던 동물이 죽으면 
    그들은 무지개 다리로 가지요. 
    
    다리를 건너기 전 우리들의 모든 특별한 친구들이 
    뛰놀 수 있는 초원과 언덕이 존재합니다. 
    
    그곳에는 넘치는 음식, 물, 햇살이 있고 
    우리 친구들은 언제나 따뜻하고 편안하답니다.`,
    `아프고 나이 들었던 동물들은 
    건강과 활력을 되찾고

    다치고 불구가 된 친구들은 
    온전하고 튼튼하게 됩니다.

    우리 꿈속에 그들과 함께했던 기억들처럼 말이죠.

    그곳에 있는 동물들은 행복하고 만족스럽습니다. 딱 한 가지를 빼놓고 말이죠.`,
    `그들은 지상에 남겨진 그들에게 
    소중하고 특별한 그 사람을 아주 그리워합니다.

    그들은 같이 뛰놀고 장난치며 놀다가 
    그 중 한 아이는 갑자기 저 멀리를 바라봅니다.

    그 아이의 눈은 반짝거리며 한 곳에 집중되고 
    몸은 떨립니다.`,
    `갑자기 아이는 친구들 틈에서 벗어나 
    푸릇푸릇한 잔디 위를 달립니다.

    더 빨리 힘껏 달립니다.

    아이는 당신을 발견했습니다.`,
    `당신과 당신의 특별한 친구가 드디어 만나는 순간

    둘은 행복으로 서로를 끌어안고 
    다시는 떨어지지 않을 것을 약속합니다.

    뽀뽀 세례가 당신에게 쏟아지고, 
    당신의 손은 다시 한번 
    그 따뜻한 몸을 쓰다듬습니다.

    당신은 다시 한번 믿음이 가득한 
    당신의 반려동물의 눈을 바라봅니다.`,
    `삶에서는 떠났지만 
    마음에서는 한번도 떠난 적이 없는...

    그리고 이제 둘은 같이 저기 있는 
    무지개 다리를 건넙니다.

    ― 작자 미상의 시, 《무지개 다리를 건너다》`,
  ];

  return (
    <Container>
      <BgImage source={bgImage} />
      <TextBox
        isIntro={isIntro}
        fstep={fstep}
        text={isIntro ? introTextArray : outroTextArray}
        navigation={navigation}
        setProgress={setProgress}
        farewellId={farewellId}
        setFstep={setFstep}
      />
    </Container>
  );
};

const TextBox = ({
  isIntro,
  text = [],
  navigation,
  setProgress,
  farewellId,
  fstep,
  setFstep,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNextScreen = async () => {
    if (isIntro) {
      setProgress('recognize');
      await post(config.RECOGNIZE.CREATE(farewellId));
      const res = await put(config.FAREWELL.FSTEP_INCREASE(farewellId, fstep));
      setFstep(res.result);
      navigation.navigate('RebornStackNavigator', {
        screen: 'RebornMainScreen',
      });
    } else {
      setProgress('end');
      navigation.navigate('TabNavigator', {screen: 'HomeScreen'});
    }
  };

  const handlePress = () => {
    if (currentIndex < text.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      goToNextScreen();
    }
  };

  if (!text.length) return null; // text 배열이 비어있는 경우 렌더 방지

  return (
    <NarationPressable isIntro={isIntro} onPress={handlePress}>
      <NarationText>{text[currentIndex]}</NarationText>
    </NarationPressable>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: ${colors.white};
`;

const BgImage = styled.ImageBackground`
  flex: 1;
  width: 100%;
  height: 100%;
`;

const NarationPressable = styled.Pressable`
  width: ${width * 0.8}px;
  height: ${({isIntro}) => (isIntro ? 200 : height * 0.55)}px;
  position: absolute;
  top: ${height * 0.1};
  left: 50%;
  padding: 32px 28px;
  border-radius: ${width * 0.03}px;
  background-color: rgba(255, 255, 255, 0.85);
  margin-left: -${width * 0.4}px;
  justify-content: center;
  align-items: center;
`;

const NarationText = styled.Text`
  font-family: 'KyoboHandwriting2019';
  font-size: 16px;
  text-align: center;
`;

export default IntroOutroScreen;
