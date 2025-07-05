import React from 'react';
import styled from 'styled-components/native';
import colors from '../../../constants/colors';

import { NpsText } from '../../../components/CustomText';
import { Dimensions } from 'react-native';

import MemoryButton from './MemoryButton';

import RemindBlackIcon from '../../../assets/images/others/remind_black.svg';
import RemindWhiteIcon from '../../../assets/images/others/remind_white.svg';
import RecordWhiteIcon from '../../../assets/images/others/record_white.svg';
import RecordBlackIcon from '../../../assets/images/others/record_black.svg';
import ContentIcon from '../../../assets/images/others/content.svg';

const { width, height } = Dimensions.get('window');

const MemoryBox = ({ remindActive, recordActive, onPress }) => {
  return (
    <Container onPress={onPress}>
      <ButtonRow>
        <MemoryButton
          icon={
            remindActive ? (
              <RemindBlackIcon width={width * 0.08} height={width * 0.08} />
            ) : (
              <RemindWhiteIcon width={width * 0.08} height={width * 0.08} />
            )
          }
          label="REMIND"
          active={remindActive}
        />
        <MemoryButton
          icon={
            recordActive ? (
              <RecordBlackIcon width={width * 0.08} height={width * 0.08} />
            ) : (
              <RecordWhiteIcon width={width * 0.08} height={width * 0.08} />
            )
          }
          label="RECORD"
          active={recordActive}
        />
      </ButtonRow>
      <DescriptionRow>
        <Description>
          반려동물과의 소중한 순간을 기록하고{'\n'}되돌아 보며 더욱 깊은
          유대감을 쌓아 보세요
        </Description>
        <ContentIcon width={width * 0.08} height={width * 0.08} />
      </DescriptionRow>
    </Container>
  );
};

const Container = styled.TouchableOpacity`
  background-color: ${colors.white};
  padding: ${width * 0.055}px ${width * 0.04}px;
  border-width: 2px;
  border-color: ${colors.gray200};
  border-radius: ${width * 0.02}px;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: center;
  width: 100%;
  padding: 0px 16px;
  margin-bottom: 5%;
`;

const DescriptionRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
`;

const Description = styled(NpsText)`
  font-size: ${width * 0.032}px;
  color: ${colors.brown};
  text-align: left;
  line-height: ${width * 0.04}px;
`;

export default MemoryBox;
