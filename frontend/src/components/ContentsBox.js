import React from 'react';
import {Dimensions} from 'react-native';
import colors from '../constants/colors';
import styled from 'styled-components/native';

// 🔹 모든 아이콘을 미리 import하고 객체에 저장
import RemindIcon from './../assets/images/others/remind_black.svg';
import RecordIcon from './../assets/images/others/record_black.svg';

import SurveyIcon from './../assets/images/others/survey.svg';
import WalkIcon from './../assets/images/others/walk.svg';
import ImageIcon from './../assets/images/others/image_diary.svg';
import ArragngeIcon from './../assets/images/others/arrange.svg';
import LetterIcon from './../assets/images/others/letter.svg';
import ContentIcon from './../assets/images/others/content.svg';

const ICONS = {
  remind: RemindIcon,
  record: RecordIcon,
  survey: SurveyIcon,
  walk: WalkIcon,
  image: ImageIcon,
  arrange: ArragngeIcon,
  letter: LetterIcon,
  nextDay: ContentIcon,
};

const {width} = Dimensions.get('window');

const ContentsBox = ({
  iconText,
  contentsText,
  iconName,
  isYellow = false,
  onPress,
}) => {
  const IconSvg = ICONS[iconName];

  return (
    <Container onPress={onPress}>
      <ContentsWrapper>
        <IconWrapper>
          <IconSvg width={width * 0.08} height={width * 0.08} />
          <IconText>{iconText}</IconText>
        </IconWrapper>
        {isYellow ? (
          <>
            <ContentsTextWrapper>
              <ContentsYellowText>RE</ContentsYellowText>
              <ContentsText>{contentsText}</ContentsText>
            </ContentsTextWrapper>
          </>
        ) : (
          <ContentsText>{contentsText}</ContentsText>
        )}
      </ContentsWrapper>
    </Container>
  );
};

const Container = styled.TouchableOpacity`
  display: flex;
  align-items: center;
`;

const ContentsWrapper = styled.View`
  display: flex;
  flex-direction: row;
  width: fit-content;
  min-width: ${width * 0.86};
  height: fit-content;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 14px;
  background-color: rgba(255, 255, 255, 0.85);
  justify-content: flex-start;
`;

const IconWrapper = styled.View`
  display: flex;
  flex-direction: column;
  width: fit-content;
  height: fit-content;
  align-items: center;
  gap: 4px;
`;

const IconText = styled.Text`
  font-family: 'NPSfont_extrabold';
  color: ${colors.brown};
  font-size: ${width * 0.034};
`;

const ContentsTextWrapper = styled.Text`
  display: flex;
  flex-direction: row;
`;

const ContentsYellowText = styled.Text`
  font-family: 'NPSfont_bold';
  color: ${colors.yellow};
  font-size: ${width * 0.034};
`;

const ContentsText = styled.Text`
  font-family: 'NPSfont_bold';
  color: ${colors.brown};
  font-size: ${width * 0.034};
`;

export default ContentsBox;
