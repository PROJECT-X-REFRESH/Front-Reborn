import React, {useState} from 'react';
import {Dimensions, Pressable, Modal} from 'react-native';
import colors from '../constants/colors';
import styled from 'styled-components/native';

import PaperImage from './../assets/images/others/paper.png';
import PinImage from './../assets/images/others/pins.svg';

import EmotionImage from './../assets/images/others/emotion_analyze.svg';
import SunImage from './../assets/images/others/sun.svg';
import CloudImage from './../assets/images/others/cloud.svg';
import RainImage from './../assets/images/others/rain.svg';

import {MATGIM_API_KEY} from '@env';

const {width, height} = Dimensions.get('window');

const EmotionDiary = ({
  onPress,
  setIconName,
  editable = true,
  defaultContents = '',
  defaultEmotion = 'default',
  isEditMode = false,
  onDelete,
}) => {
  const [contents, setContents] = useState(defaultContents);
  const [emotionIcon, setEmotionIcon] = useState(defaultEmotion);
  const [showResultModal, setShowResultModal] = useState(false);

  const today = new Date();
  const formattedToday = `${today.getFullYear()}-${String(
    today.getMonth() + 1,
  ).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const getFormattedDate = dateStr => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      weekday: weekdays[date.getDay()],
    };
  };

  const formatted = getFormattedDate(formattedToday);

  const handleEmotionAnalyze = async () => {
    try {
      const API_URL = 'https://api.matgim.ai/54edkvw2hn/api-sentiment';
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': 'fd7dd54e-2499-489f-806f-c3171c565bab',
        },
        body: JSON.stringify({document: contents}),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const json = await response.json();
      const score = json.result?.document_score?.score;
      console.log('감정 분석 결과 점수:', score);

      if (score > 0) setEmotionIcon('SUN');
      else if (score < 0) setEmotionIcon('RAIN');
      else setEmotionIcon('CLOUD');

      setShowResultModal(true);
      setIconName?.(emotionIcon);
    } catch (error) {
      console.error('감정분석 API 호출 실패:', error);
    }
  };

  const renderEmotionIcon = (iconSize = width * 0.06) => {
    switch (emotionIcon) {
      case 'SUN':
        return <SunImage width={iconSize} height={iconSize} />;
      case 'RAIN':
        return <RainImage width={iconSize} height={iconSize} />;
      case 'CLOUD':
        return <CloudImage width={iconSize} height={iconSize} />;
      default:
        return <EmotionImage width={iconSize} height={iconSize} />;
    }
  };

  return (
    <>
      <DiaryContainer source={PaperImage}>
        <PinImage width={width * 0.86} height={width * 0.065} />
        <ContentsContainer>
          <ContentsWrapper>
            <TitleWrapper>
              <NpsText style={{letterSpacing: 2}}>
                {formatted && (
                  <>
                    <WritingText>{formatted.year}</WritingText>년{' '}
                    <WritingText>{formatted.month}</WritingText>월{' '}
                    <WritingText>{formatted.day}</WritingText>일{' '}
                    <WritingText>{formatted.weekday}</WritingText>요일
                  </>
                )}
              </NpsText>
              <EmotionWrapper>
                <NpsText style={{letterSpacing: 2}}>감정날씨</NpsText>
                <Pressable onPress={handleEmotionAnalyze}>
                  {renderEmotionIcon()}
                </Pressable>
              </EmotionWrapper>
            </TitleWrapper>
            {editable ? (
              <WritingArea
                value={contents}
                onChangeText={setContents}
                multiline
                placeholder="일기를 작성해주세요."
              />
            ) : (
              <ReadOnlyText>
                {contents || '작성된 일기가 없습니다.'}
              </ReadOnlyText>
            )}
          </ContentsWrapper>
          {editable && (
            <ActionButtonsWrapper>
              {isEditMode && (
                <DeleteButton onPress={onDelete}>
                  <DeleteText>삭제</DeleteText>
                </DeleteButton>
              )}
              <SaveButton
                contents={contents}
                emotionIcon={emotionIcon}
                onPress={onPress}
                isEditMode={isEditMode}
              />
            </ActionButtonsWrapper>
          )}
        </ContentsContainer>
      </DiaryContainer>

      {showResultModal && (
        <Modal
          visible={showResultModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowResultModal(false)}>
          <ModalBackground onPress={() => setShowResultModal(false)}>
            <ResultBox onStartShouldSetResponder={() => true}>
              <NpsText style={{fontSize: width * 0.042, marginBottom: 8}}>
                오늘의 감정 날씨는
              </NpsText>
              {renderEmotionIcon(width * 0.3)}
              <ResultText>
                {emotionIcon === 'SUN'
                  ? '맑음'
                  : emotionIcon === 'RAIN'
                  ? '비'
                  : '구름'}
              </ResultText>
              <ResultSubText>
                {emotionIcon === 'SUN'
                  ? '기분 좋은 하루!\n내일도 이 기분을 이어가자!'
                  : emotionIcon === 'RAIN'
                  ? '힘든 하루\n내일을 위해 조금 쉬어가자'
                  : '평범한 하루\n내일도 흐름에 맡겨보자'}
              </ResultSubText>
            </ResultBox>
          </ModalBackground>
        </Modal>
      )}
    </>
  );
};

const SaveButton = ({contents, emotionIcon, onPress, isEditMode}) => {
  const emotion =
    emotionIcon === 'SUN' || emotionIcon === 'RAIN' || emotionIcon === 'CLOUD'
      ? emotionIcon
      : 'CLOUD';

  const handleSave = () => {
    if (!contents || emotionIcon === 'default') {
      alert('일기와 감정날씨를 입력해주세요.');
      return;
    }

    onPress?.({
      content: contents,
      emotion: {state: emotion},
    });
  };
  return (
    <BrownPressable onPress={handleSave}>
      <SaveText>{isEditMode ? '수정' : '저장'}</SaveText>
    </BrownPressable>
  );
};

const DiaryContainer = styled.ImageBackground`
  flex: 1;
  border-radius: 6px;
  border: 1px ${colors.black} solid;
  overflow: hidden;
`;

const ContentsContainer = styled.View`
  flex: 1;
  align-items: flex-end;
  flex-direction: column;
  padding: ${height * 0.02}px;
  gap: 16px;
`;

const ContentsWrapper = styled.View`
  width: 100%;
  flex: 1;
  align-items: flex-start;
`;

const TitleWrapper = styled.View`
  width: 100%;
  justify-content: space-between;
  flex-direction: row;
`;

const EmotionWrapper = styled.View`
  flex-direction: row;
  gap: 8px;
`;

const WritingArea = styled.TextInput`
  flex: 1;
  text-align: left;
  text-align-vertical: top;
  font-family: 'KyoboHandwriting2019';
  font-size: ${width * 0.04}px;
`;

const ReadOnlyText = styled.Text`
  margin-top: 16px;
  line-height: 26px;
  font-family: 'KyoboHandwriting2019';
  font-size: ${width * 0.04}px;
  color: ${colors.brown};
`;

const BrownPressable = styled.Pressable`
  width: fit-content;
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

const ActionButtonsWrapper = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
`;

const DeleteButton = styled.Pressable`
  background-color: ${colors.red};
  border-radius: 24px;
  padding: 6px 18px;
  align-items: center;
`;

const DeleteText = styled.Text`
  color: ${colors.white};
  font-family: 'NPSfont_bold';
  font-size: ${width * 0.038}px;
`;

const NpsText = styled.Text`
  font-family: 'NPSfont_bold';
  color: ${colors.brown};
  font-size: ${width * 0.034}px;
`;

const WritingText = styled.Text`
  font-family: 'KyoboHandwriting2019';
  color: ${colors.brown};
  font-size: ${width * 0.04}px;
`;

const ModalBackground = styled.Pressable`
  position: absolute;
  top: 0;
  left: 0;
  width: ${width}px;
  height: ${height}px;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  z-index: 99;
`;

const ResultBox = styled.View`
  width: 320px;
  height: 380px;
  background-color: white;
  border-radius: 24px;
  padding: 28px;
  justify-content: center;
  align-items: center;
`;

const ResultText = styled.Text`
  font-size: ${width * 0.06}px;
  font-family: 'NPSfont_bold';
  color: ${colors.brown};
  margin-top: 12px;
`;

const ResultSubText = styled.Text`
  margin-top: 12px;
  font-size: ${width * 0.034}px;
  font-family: 'NPSfont_regular';
  text-align: center;
  line-height: 24px;
  color: ${colors.brown};
`;

export default EmotionDiary;
