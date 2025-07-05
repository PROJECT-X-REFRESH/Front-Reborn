import React, {useState} from 'react';
import {Dimensions, ScrollView} from 'react-native';
import styled from 'styled-components/native';
import colors from './../constants/colors';

import PaperImage from './../assets/images/others/paper.png';
import PaperPawImage from './../assets/images/others/paper_paw.png';

const {width, height} = Dimensions.get('window');

const Letter = ({
  isInput = false,
  contents = '',
  setContents,
  onPress,
  toName = '',
  fromName = '',
}) => {
  return (
    <LetterContainer source={isInput ? PaperImage : PaperPawImage}>
      <LetterWrapper>
        <LetterText>To. {toName}</LetterText>
        {isInput ? (
          <LetterInput
            value={contents}
            onChangeText={setContents}
            multiline
            placeholder="편지 내용을 입력하세요. 입력한 편지는 다시 볼 수 없으니 편안한 마음으로 작성해보세요."
          />
        ) : (
          <ScrollView showsVerticalScrollIndicator={true} style={{flex: 1}}>
            <LetterContents>{contents}</LetterContents>
          </ScrollView>
        )}
      </LetterWrapper>
      {isInput ? (
        <SaveButton contents={contents} onPress={onPress} />
      ) : (
        <LetterText>From. {fromName}</LetterText>
      )}
    </LetterContainer>
  );
};

const SaveButton = ({contents, onPress}) => {
  const handleSave = () => {
    if (!contents) {
      alert('편지를 작성해주세요.');
      return;
    }

    onPress?.({
      petPost: contents,
    });
  };

  return (
    <BrownPressable onPress={handleSave}>
      <SaveText>저장</SaveText>
    </BrownPressable>
  );
};

const LetterContainer = styled.ImageBackground`
  flex: 1;
  border: 1px ${colors.black} solid;
  align-items: space-between;
  border-radius: 6px;
  padding: 28px 24px;
  gap: 16px;
  background-color: pink;
`;

const LetterWrapper = styled.View`
  flex: 1;
  width: 100%;
  align-items: flex-start;
  gap: 10px;
  flex-shrink: 1;
`;

const LetterText = styled.Text`
  font-family: 'KyoboHandwriting2019';
  color: ${colors.brown};
  font-size: ${width * 0.05}px;
`;

const LetterInput = styled.TextInput`
  width: 100%;
  text-align: left;
  text-align-vertical: top;
  font-family: 'KyoboHandwriting2019';
  font-size: ${width * 0.04}px;
`;

const LetterContents = styled.Text`
  flex: 1;
  text-align: left;
  text-align-vertical: top;
  font-family: 'KyoboHandwriting2019';
  font-size: ${width * 0.04}px;
`;

const BrownPressable = styled.Pressable`
  width: 68px;
  background-color: ${colors.brown};
  border-radius: 24px;
  padding: 6px 18px;
  align-items: center;
`;

const SaveText = styled.Text`
  color: ${colors.white};
  font-family: 'NPSfont_bold';
  font-size: ${width * 0.038}px;
`;

export default Letter;
