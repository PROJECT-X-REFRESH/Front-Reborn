import React from 'react';
import styled from 'styled-components/native';
import colors from '../../../constants/colors';

import {Dimensions} from 'react-native';
import {NpsText} from '../../../components/CustomText';

import MemoryButton from './MemoryButton';

import RibbonBlackIcon from '../../../assets/images/others/ribbon_black.svg';
import RibbonWhiteIcon from '../../../assets/images/others/ribbon_white.svg';
import ContentIcon from '../../../assets/images/others/content.svg';
import RightArrow from '../../../assets/images/others/right_arrow.svg';

const {width, height} = Dimensions.get('window');

const FarewallBox = ({fstep, onPress}) => {
  const isStepActive = targetStep => fstep >= targetStep;

  const recognizeProps = {
    icon: isStepActive(1) ? (
      <RibbonBlackIcon width={30} height={30} />
    ) : (
      <RibbonWhiteIcon width={30} height={30} />
    ),
    active: isStepActive(1),
  };

  const revealProps = {
    icon: isStepActive(3) ? (
      <RibbonBlackIcon width={30} height={30} />
    ) : (
      <RibbonWhiteIcon width={30} height={30} />
    ),
    active: isStepActive(3),
  };

  const rememberProps = {
    icon: isStepActive(5) ? (
      <RibbonBlackIcon width={30} height={30} />
    ) : (
      <RibbonWhiteIcon width={30} height={30} />
    ),
    active: isStepActive(5),
  };

  const rebirthProps = {
    icon: isStepActive(7) ? (
      <RibbonBlackIcon width={30} height={30} />
    ) : (
      <RibbonWhiteIcon width={30} height={30} />
    ),
    active: isStepActive(7),
  };

  const farewellText =
    fstep === 8
      ? `이제 작별은 끝났지만,\nREVIEW에서 언제든 다시 만나볼 수 있어요`
      : `반려동물과의 건강한 이별을 준비하고\n소중한 추억을 정리할 수 있도록 도와줍니다`;

  const farewellOnPress = fstep === 8 ? null : onPress;

  return (
    <Container onPress={farewellOnPress}>
      <ButtonRow>
        <MemoryButton
          icon={recognizeProps.icon}
          label="RECOGNIZE"
          active={recognizeProps.active}
        />
        <ArrowContainer>
          <RightArrow />
        </ArrowContainer>
        <MemoryButton
          icon={revealProps.icon}
          label="REVEAL"
          active={revealProps.active}
        />
        <ArrowContainer>
          <RightArrow />
        </ArrowContainer>
        <MemoryButton
          icon={rememberProps.icon}
          label="REMEMBER"
          active={rememberProps.active}
        />
        <ArrowContainer>
          <RightArrow />
        </ArrowContainer>
        <MemoryButton
          icon={rebirthProps.icon}
          label="REBIRTH"
          active={rebirthProps.active}
        />
      </ButtonRow>
      <DescriptionRow>
        <Description>{farewellText}</Description>
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
  align-items: center;
  width: 100%;
  margin-bottom: 5%;
`;

const ArrowContainer = styled.View`
  justify-content: center;
  align-items: center;
  margin: 0 -${width * 0.01}px;
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

export default FarewallBox;
