import React, {useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Text, FlatList, TouchableOpacity, Dimensions} from 'react-native';
import {NpsText, NpsBText} from '../../components/CustomText';
import styled from 'styled-components/native';
import colors from '../../constants/colors';

const {width, height} = Dimensions.get('window');

const tutorialData = [
  {
    id: '1',
    text: [
      {content: '안녕하세요 :)\n', style: {color: colors.brown}},
      {content: 'RE', style: {color: colors.yellow, fontWeight: 'bold'}},
      {content: 'BORN', style: {color: colors.brown, fontWeight: 'bold'}},
      {
        content: '은 반려동물과 보호자의 소중한 순간을\n',
        style: {color: colors.brown},
      },
      {
        content: '기록하고 추억을 간직할 수 있는\n애플리케이션 서비스 입니다.',
        style: {color: colors.brown},
      },
    ],
  },
  {
    id: '2',
    text: [
      {content: 'RE', style: {color: colors.yellow, fontWeight: 'bold'}},
      {
        content: 'BORN 추억쌓기',
        style: {color: colors.brown, fontWeight: 'bold'},
      },
      {
        content: '를 통해 반려동물과 대화하거나,\n',
        style: {color: colors.brown},
      },
      {
        content:
          '반려일기를 작성하며 특별한 추억을 남겨보세요.\n\n반려동물이 떠난 경우, ',
        style: {color: colors.brown},
      },
      {content: 'RE', style: {color: colors.yellow, fontWeight: 'bold'}},
      {
        content: 'BORN 작별하기',
        style: {color: colors.brown, fontWeight: 'bold'},
      },
      {
        content: '를 통해\n추억을 정리하고 건강한 이별을 함께하세요.',
        style: {color: colors.brown},
      },
    ],
  },
  {
    id: '3',
    text: [
      {content: '다양한 ', style: {color: colors.brown}},
      {
        content: '나눔 게시판',
        style: {fontWeight: 'bold', color: colors.brown},
      },
      {
        content: '에서 다른 보호자들과\n소통하며 정보를 공유하세요.\n\n',
        style: {color: colors.brown},
      },
      {content: '오늘의 ', style: {color: colors.brown}},
      {content: 'RE', style: {color: colors.yellow, fontWeight: 'bold'}},
      {
        content: 'TURN 포스트',
        style: {color: colors.brown, fontWeight: 'bold'},
      },
      {content: '를 확인하고,\n', style: {color: colors.brown}},
      {content: 'RE', style: {color: colors.yellow, fontWeight: 'bold'}},
      {content: 'TURN', style: {color: colors.brown, fontWeight: 'bold'}},
      {content: '에게 궁금한 점을 물어보세요.', style: {color: colors.brown}},
    ],
  },
];

const TutorialScreen = ({}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const navigation = useNavigation();

  const handleNavigate = () => {
    navigation.navigate('NicknameScreen');
  };

  const RenderStyledText = ({textArray}) => {
    return (
      <Text>
        {textArray.map((part, index) => {
          const splitText = part.content.split('\n');
          return splitText.map((line, lineIndex) => (
            <Text
              key={`${index}-${lineIndex}`}
              style={[
                {
                  fontSize: width * 0.037,
                  fontFamily: 'NPSfont_regular',
                  lineHeight: 24,
                },
                part.style,
              ]}>
              {line}
              {lineIndex !== splitText.length - 1 ? '\n' : ''}
            </Text>
          ));
        })}
      </Text>
    );
  };

  return (
    <Container>
      <TitleContainer>
        <TitleText>
          <HBHighlightText>RE</HBHighlightText>BORN
        </TitleText>
        <SubTitleText>
          <HighlightText>RE</HighlightText>BORN에 오신것을 환영합니다!
        </SubTitleText>
      </TitleContainer>

      <FlatList
        ref={flatListRef}
        data={tutorialData}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={event => {
          const newIndex = Math.round(
            event.nativeEvent.contentOffset.x / width,
          );
          setCurrentIndex(newIndex);
        }}
        renderItem={({item}) => (
          <TextContainer>
            <TutorialImage
              source={require('../../assets/images/logos/logo_intro.png')}
            />
            <RenderStyledText textArray={item.text} />
          </TextContainer>
        )}
      />
      <IndicatorContainer>
        {tutorialData.map((_, index) => (
          <Indicator key={index} isActive={index === currentIndex} />
        ))}
      </IndicatorContainer>
      {currentIndex === tutorialData.length - 1 && (
        <NextButton onPress={handleNavigate}>
          <ButtonText>
            <HighlightText>RE</HighlightText>BORN 시작하기
          </ButtonText>
        </NextButton>
      )}
    </Container>
  );
};

export default TutorialScreen;

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${colors.white};
  padding: ${height * 0.08}px 0px;
`;

const TitleContainer = styled.View`
  align-items: center;
`;

const TitleText = styled.Text`
  font-size: ${width * 0.12}px;
  font-family: 'Hakgyoansim Dunggeunmiso TTF B';
  color: ${colors.brown};
  margin: 10px;
`;

const SubTitleText = styled(NpsBText)`
  font-size: ${width * 0.04}px;
  color: ${colors.brown};
`;

const HBHighlightText = styled.Text`
  font-size: ${width * 0.12}px;
  color: ${colors.yellow};
  font-family: 'Hakgyoansim Dunggeunmiso TTF B';
`;

const HighlightText = styled(NpsBText)`
  color: ${colors.yellow};
`;

const TutorialImage = styled.Image`
  width: 80%;
  height: undefined;
  aspect-ratio: 1;
  margin: 30px 0;
`;

const TextContainer = styled.View`
  width: ${width}px;
  height: ${height * 0.2}px;
  align-items: center;
  justify-content: flex-start;
  padding: ${width * 0.02}px;
`;

const IndicatorContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-bottom: 90px;
`;

const Indicator = styled.View`
  width: ${width * 0.015}px;
  height: ${width * 0.015}px;
  border-radius: 5px;
  margin: 0 5px;
  background-color: ${({isActive}) =>
    isActive ? colors.yellow : colors.gray200};
`;

const NextButton = styled.TouchableOpacity`
  bottom: ${height * 0.1}px;
  position: absolute;
  right: ${width * 0.1}px;
  bottom: ${height * 0.1}px;
  justify-content: flex-end;
`;

const ButtonText = styled(NpsBText)`
  font-size: ${width * 0.037}px;
  color: ${colors.brown};
`;
