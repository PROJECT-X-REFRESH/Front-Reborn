import React from 'react';
import {Dimensions} from 'react-native';
import styled from 'styled-components/native';
import AnimalImages from '../../components/AnimalImages';
import {useReborn} from './../../context/RebornContext';

import ThinkSrc3 from './../../assets/images/others/think1.png';
import ThinkSrc2 from './../../assets/images/others/think2.png';

import FeedIcon_dog from './../../assets/images/pets/dog/others/dog_bowl.png';
import FeedIcon_cat from './../../assets/images/pets/cat/others/cat_bowl.png';

import SnackIcon_dog from './../../assets/images/pets/dog/others/dog_snack.png';
import SnackIcon_cat from './../../assets/images/pets/cat/others/cat_snack.png';

import ShowerIcon from './../../assets/images/pets/others/showerhead.png';
import BlackRibbonIcon from './../../assets/images/pets/others/ribbon_black.png';
import YellowRibbonIcon from './../../assets/images/pets/others/ribbon_yellow.png';

const {width, height} = Dimensions.get('window');

const Animal = ({
  animalType,
  animalColor,
  animalAction,
  onPress1,
  onPress2,
  onPress3,
  whatContents = 'contents',
}) => {
  const AnimalSrc = AnimalImages?.[animalType]?.[animalColor]?.[animalAction];
  const AnimalFaceSrc = AnimalImages?.[animalType]?.[animalColor]?.face;

  const {isFeed, isSnack, isWalk} = useReborn();

  const snackIcon = animalType === 'CAT' ? SnackIcon_cat : SnackIcon_dog;
  const feedIcon = animalType === 'CAT' ? FeedIcon_cat : FeedIcon_dog;

  const renderContents = () => {
    switch (whatContents) {
      case 'contents':
        return (
          <>
            {!isFeed && (
              <ThinkBox1 onPress={onPress1}>
                <ThinkbBubble source={ThinkSrc3} />
                <ThinkIcon1 source={feedIcon} />
              </ThinkBox1>
            )}
            {!isWalk && (
              <ThinkBox2 onPress={onPress2}>
                <ThinkbBubble source={ThinkSrc2} />
                <ThinkIcon2 source={AnimalFaceSrc} />
              </ThinkBox2>
            )}
            {!isSnack && (
              <ThinkBox3 onPress={onPress3}>
                <ThinkbBubble source={ThinkSrc3} />
                <ThinkIcon1 source={snackIcon} />
              </ThinkBox3>
            )}
          </>
        );
      case 'wash':
        return (
          <>
            <ThinkBox3 onPress={onPress3}>
              <ThinkbBubble source={ThinkSrc3} />
              <ThinkIcon1 source={ShowerIcon} />
            </ThinkBox3>
          </>
        );
      case 'ribbon':
        return (
          <>
            <ThinkBox1 onPress={onPress1}>
              <ThinkbBubble source={ThinkSrc3} />
              <ThinkIcon1 source={YellowRibbonIcon} />
            </ThinkBox1>
            <ThinkBox3 onPress={onPress2}>
              <ThinkbBubble source={ThinkSrc3} />
              <ThinkIcon1 source={BlackRibbonIcon} />
            </ThinkBox3>
          </>
        );
      case 'none':
      default:
        return null;
    }
  };

  return (
    <Container>
      {renderContents()}
      <AnimalContainer>
        <AnimalImage source={AnimalSrc} />
      </AnimalContainer>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  justify-content: flex-end;
  align-items: center;
`;

const AnimalContainer = styled.View`
  position: relative;
  bottom: ${height * 0.1};
  width: ${width * 0.5};
  height: ${height * 0.25};
  align-items: center;
  justify-content: center;
`;

const AnimalImage = styled.Image`
  width: 100%;
  height: 100%;
  resize-mode: contain;
`;

const ThinkBox1 = styled.TouchableOpacity`
  position: relative;
  left: -${width * 0.28};
  bottom: ${height * 0.1};
  align-items: center;
  justify-content: center;
  transform: scaleX(-1);
  resize-mode: contain;
`;

const ThinkBox2 = styled.TouchableOpacity`
  position: relative;
  left: ${width * 0.01};
  bottom: ${height * 0.13};
  align-items: center;
  justify-content: center;
  resize-mode: contain;
`;

const ThinkBox3 = styled.TouchableOpacity`
  position: relative;
  left: ${width * 0.28};
  bottom: ${height * 0.1};
  align-items: center;
  justify-content: center;
  resize-mode: contain;
`;

const ThinkbBubble = styled.Image`
  position: absolute;
  width: ${width * 0.22};
  height: ${height * 0.1};
  align-items: center;
  justify-content: center;
  resize-mode: contain;
`;

const ThinkIcon1 = styled.Image`
  position: absolute;
  left: -${width * 0.072};
  bottom: -${height * 0.035};
  width: ${width * 0.16};
  height: ${width * 0.16};
  resize-mode: contain;
`;

const ThinkIcon2 = styled.Image`
  position: absolute;
  left: -${width * 0.08};
  bottom: -${height * 0.028};
  width: ${width * 0.16};
  height: ${width * 0.16};
  resize-mode: contain;
`;

export default Animal;
