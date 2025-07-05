/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {Dimensions, TouchableOpacity} from 'react-native';
import {NpsText, NpsBText} from '../../components/CustomText';
import styled from 'styled-components/native';
import colors from './../../constants/colors';
import {useReborn} from './../../context/RebornContext';

import LogoImage from '../../assets/images/logos/logo_intro.png';
import CheckWhiteIcon from '../../assets/images/others/check_white.svg';

import {post} from '../../services/api';
import config from '../../constants/config';

const {width, height} = Dimensions.get('window');

const SurveyScreen = ({navigation}) => {
  const {farewellId, setIsContents1} = useReborn();

  const [currentState, setCurrentState] = useState('intro');
  const [scoreSum, setScoreSum] = useState(0);

  // 검사 시작하기 -> 검사중 -> 검사 끝내기 state 변경
  const handleContentsNext = async () => {
    if (currentState === 'intro') {
      setCurrentState('survey');
    } else if (currentState === 'survey') {
      setCurrentState('outro');
    }
  };

  useEffect(() => {
    async function submitSurvey() {
      await post(config.RECOGNIZE.SURVEY(farewellId), {score: scoreSum});
    }

    if (currentState === 'outro') {
      submitSurvey();
    }
  }, [scoreSum, currentState]);

  return (
    <Container>
      {currentState === 'intro' && (
        <IntroContents onNext={handleContentsNext} />
      )}
      {currentState === 'survey' && (
        <SurveyContents
          onNext={handleContentsNext}
          scoreSum={scoreSum}
          setScoreSum={setScoreSum}
        />
      )}
      {currentState === 'outro' && (
        <OutroContents
          scoreSum={scoreSum}
          navigation={navigation}
          setIsContents1={setIsContents1}
          farewellId={farewellId}
        />
      )}
    </Container>
  );
};

const IntroContents = ({onNext}) => {
  return (
    <ContainerWrapper>
      <GrayBackground>
        <PetImage source={LogoImage} />
        <ExplainText />
      </GrayBackground>
      <NextButton onPress={onNext}>
        <NpsBoldText>검사 시작하기</NpsBoldText>
      </NextButton>
    </ContainerWrapper>
  );
};

const ExplainText = () => {
  return (
    <NpsCenterText>
      <NpsBoldText>반려동물애도 설문지 검사(PBQ)</NpsBoldText>는{'\n'}펜실베니아
      심리학과에서 개발된{'\n'}
      <NpsBoldText>펫로스 증후군</NpsBoldText> 상태를 알아보는 데{'\n'}도움을 줄
      수 있는 설문지 검사입니다.
      {'\n'}
      {'\n'}지금부터 <NpsBoldText>반려동물애도 설문지 검사</NpsBoldText>를 통해
      {'\n'}당신의 <NpsBoldText>펫로스 증후군 상태</NpsBoldText>를
      알아보겠습니다.{'\n'}
      {'\n'}문제를 잘 읽고{'\n'}신중히 선택해 주시기 바랍니다.
    </NpsCenterText>
  );
};

const SurveyContents = ({onNext, scoreSum, setScoreSum}) => {
  const [scoreSelected, setScoreSelected] = useState(1);
  const [questionIndex, setQuestionIndex] = useState(0);

  const questionArray = [
    '나는 반려동물을 살리지 못한 수의사에게 화가 난다.',
    '나는 반려동물의 죽음이 매우 속상하다.',
    '반려동물이 없는 나의 삶은 비어있는 것 같다.',
    '나는 반려동물의 죽음에 대한 악몽을 꾸고 있다.',
    '나는 반려동물이 없는데 대해 외로움을 느낀다.',
    '나는 반려동물에게 뭔가 나쁜 일이 일어나고 있다는 사실을 알았어야만 했다.',
    '나는 반려동물이 너무나도 그립다.',
    '나는 반려동물을 좀 더 잘 돌보지 못한데 대한 죄책감을 느낀다.',
    '나는 반려동물을 살리고자 더 많은 행동을 하지 않았던 것에 낙담하였다.',
    '나는 반려동물을 생각하면 눈물이 난다.',
    '나는 반려동물의 죽음에 영향을 준 사람들에 대해서 화가 난다.',
    '나는 반려동물의 죽음에 대해서 큰 슬픔을 느낀다.',
    '나는 도움이 되지 않았던 친구/가족에게 화가 난다.',
    '반려동물의 마지막 순간에 대한 기억들이 뇌리에서 떠나지 않는다.',
    '나는 반려동물의 상실을 극복하지 못할 것 같다.',
    '나는 반려동물을 더 많이 사랑해 주었다면 좋았을 것이라고 생각한다.',
  ];

  const handleNext = () => {
    setScoreSum(prev => prev + scoreSelected);
    if (questionIndex < questionArray.length - 1) {
      setQuestionIndex(prev => prev + 1);
      setScoreSelected(1);
    } else {
      onNext(scoreSum);
    }
  };

  return (
    <ContainerWrapper>
      <GrayBackground>
        <ContentsWrapper>
          <QuestionWrapper>
            <NpsBoldText style={{textAlign: 'justify', lineHeight: 24}}>
              {questionArray[questionIndex]}
            </NpsBoldText>
            <RadioButton
              isSelected={scoreSelected === 1}
              onPress={() => setScoreSelected(1)}
              label="매우 그렇지 않다."
            />
            <RadioButton
              isSelected={scoreSelected === 2}
              onPress={() => setScoreSelected(2)}
              label="그렇지 않다."
            />
            <RadioButton
              isSelected={scoreSelected === 3}
              onPress={() => setScoreSelected(3)}
              label="그렇다."
            />
            <RadioButton
              isSelected={scoreSelected === 4}
              onPress={() => setScoreSelected(4)}
              label="매우 그렇다."
            />
          </QuestionWrapper>

          <NpsBoldText>{`${questionIndex + 1} / ${
            questionArray.length
          }`}</NpsBoldText>
        </ContentsWrapper>
      </GrayBackground>
      <NextButton onPress={handleNext}>
        <NpsBoldText>다음으로</NpsBoldText>
      </NextButton>
    </ContainerWrapper>
  );
};

const RadioButton = ({isSelected, onPress, label}) => {
  return (
    <RadioButtonContainer onPress={onPress}>
      <CustomRadioButton isSelected={isSelected}>
        {isSelected && (
          <CheckWhiteIcon
            width={18}
            height={18}
            style={{position: 'absolute', top: -1, left: -1}}
          />
        )}
      </CustomRadioButton>
      <NpsCenterText>{label}</NpsCenterText>
    </RadioButtonContainer>
  );
};

const ContentsWrapper = styled.View`
  align-items: center;
  padding: 26px;
  width: 100%;
  gap: 64px;
`;

const RadioButtonContainer = styled.TouchableOpacity`
  flex-direction: row;
  gap: 16px;
`;

const QuestionWrapper = styled.View`
  width: 100%;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 48px;
`;

const CustomRadioButton = styled.View`
  width: 20px;
  height: 20px;
  border-radius: 30px;
  background-color: ${({isSelected}) =>
    isSelected ? colors.brown : 'transparent'};
  border: 2px solid ${colors.brown};
  align-items: center;
`;

const OutroContents = ({scoreSum, navigation, setIsContents1, farewellId}) => {
  return (
    <ContainerWrapper>
      <GrayBackground>
        <PetImage source={LogoImage} />
        <ResultText
          scoreSum={scoreSum}
          navigation={navigation}
          farewellId={farewellId}
        />
      </GrayBackground>
      <NextButton
        onPress={() => {
          setIsContents1(true);
          navigation.navigate('RebornStackNavigator', {
            screen: 'RebornMainScreen',
          });
        }}>
        <NpsBoldText>검사 끝내기</NpsBoldText>
      </NextButton>
    </ContainerWrapper>
  );
};

const ResultText = ({scoreSum, navigation, farewellId}) => {
  return (
    <ResultTextContainer>
      <NpsLeftText>
        당신의 <NpsBoldText>반려동물애도 설문지 검사(PBQ)</NpsBoldText> 결과
      </NpsLeftText>

      {scoreSum < 36 ? (
        <>
          <NpsLeftText>
            점수는 <SumText>{scoreSum}점</SumText> 입니다
          </NpsLeftText>
          <NpsLeftText style={{lineHeight: 22}}>
            총 36점 미만이므로,{'\n'}
            펫로스 증후군 상태에 있지 않습니다.
          </NpsLeftText>
          <NpsBText>앞으로도 지금처럼 건강한 삶을 유지하세요.</NpsBText>
        </>
      ) : (
        <>
          <NpsLeftText>
            점수는 <SumText style={{color: colors.red}}>{scoreSum}점</SumText>{' '}
            입니다
          </NpsLeftText>
          <NpsLeftText style={{lineHeight: 22}}>
            총 36점 이상이므로,{'\n'}
            <NpsRedText>펫로스 증후군 상태에 있음</NpsRedText>을{'\n'}
            의심해볼 수 있습니다.
          </NpsLeftText>
          <NpsBText>나 자신을 한번 돌아보는 시간을 가져보세요.</NpsBText>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ClinicScreen', {farewellId: farewellId})
            }>
            <NpsLineText>주변의 가까운 심리상담소를 찾으시나요?</NpsLineText>
          </TouchableOpacity>
        </>
      )}
    </ResultTextContainer>
  );
};

const ResultTextContainer = styled.View`
  width: 100%;
  gap: 16px;
`;

const SumText = styled(NpsBText)`
  font-size: ${width * 0.1};
`;

const Container = styled.View`
  flex: 1;
  background-color: ${colors.white};
  align-items: center;
  justify-content: center;
  padding: ${height * 0.08}px ${width * 0.06}px;
`;

const ContainerWrapper = styled.View`
  width: 100%;
  height: ${height * 0.7};
  gap: 32px;
  justify-content: center;
  align-items: flex-end;
`;

const GrayBackground = styled.View`
  width: 100%;
  height: 560px;
  background-color: ${colors.gray100};
  border-radius: 24px;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  padding: 22px;
  gap: 22px;
`;

const PetImage = styled.Image`
  width: ${width * 0.6};
  height: ${width * 0.6};
  resize-mode: contain;
`;

const NpsCenterText = styled(NpsText)`
  text-align: center;
  font-size: ${width * 0.038};
  line-height: 22px;
`;

const NpsLineText = styled(NpsText)`
  text-align: center;
  font-size: ${width * 0.038};
  text-decoration: underline;
`;

const NpsLeftText = styled(NpsText)`
  text-align: left;
  font-size: ${width * 0.038};
`;

const NpsBoldText = styled(NpsBText)`
  font-size: ${width * 0.038};
`;

const NpsRedText = styled(NpsBText)`
  color: ${colors.red};
`;

const NextButton = styled.TouchableOpacity``;

export default SurveyScreen;
