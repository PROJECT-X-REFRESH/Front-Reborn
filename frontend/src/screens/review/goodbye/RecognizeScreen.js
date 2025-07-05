import React, {useState, useEffect} from 'react';
import {Dimensions, TouchableOpacity} from 'react-native';
import {NpsText, NpsBText} from '../../../components/CustomText';
import styled from 'styled-components/native';
import colors from '../../../constants/colors';

import LogoImage from '../../../assets/images/logos/logo_intro.png';

import {get} from '../../../services/api';
import config from '../../../constants/config';

const {width, height} = Dimensions.get('window');

const RecognizeScreen = ({navigation, route}) => {
  const {id} = route.params;
  const [score, setScore] = useState(null);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const res = await get(config.FAREWELL.REVIEW_RECOG(0, id));
        setScore(res.result.score);
      } catch (err) {
        console.error('자가진단 점수 가져오기 실패:', err);
      }
    };

    if (id) fetchScore();
  }, [id]);

  return (
    <Container>
      <ContainerWrapper>
        <GrayBackground>
          <PetImage source={LogoImage} />
          <ResultText score={score} navigation={navigation} />
        </GrayBackground>
      </ContainerWrapper>
    </Container>
  );
};

const ResultText = ({score, navigation}) => {
  return (
    <ResultTextContainer>
      <NpsLeftText>
        당신의 <NpsBoldText>반려동물애도 설문지 검사(PBQ)</NpsBoldText> 결과
      </NpsLeftText>

      {score < 36 ? (
        <>
          <NpsLeftText>
            점수는 <SumText>{score}점</SumText> 입니다
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
            점수는 <SumText style={{color: colors.red}}>{score}점</SumText>{' '}
            입니다
          </NpsLeftText>
          <NpsLeftText style={{lineHeight: 22}}>
            총 36점 이상이므로,{'\n'}
            <NpsRedText>펫로스 증후군 상태에 있음</NpsRedText>을{'\n'}
            의심해볼 수 있습니다.
          </NpsLeftText>
          <NpsBText>나 자신을 한번 돌아보는 시간을 가져보세요.</NpsBText>
          <TouchableOpacity onPress={() => navigation.navigate('ClinicScreen')}>
            <NpsLineText>주변의 가까운 심리상담소를 찾으시나요?</NpsLineText>
          </TouchableOpacity>
        </>
      )}
    </ResultTextContainer>
  );
};

export default RecognizeScreen;

const ResultTextContainer = styled.View`
  width: 100%;
  padding-bottom: 16px;
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
  height: 600px;
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
