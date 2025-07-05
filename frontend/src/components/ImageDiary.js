/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {launchImageLibrary} from 'react-native-image-picker';
import {Dimensions, Image, Modal} from 'react-native';
import {Calendar} from 'react-native-calendars';
import colors from '../constants/colors';
import styled from 'styled-components/native';

import PaperImage from './../assets/images/others/paper.png';
import PinImage from './../assets/images/others/pins.svg';
import DiaryImage from './../assets/images/others/image_diary_gray.svg';
import CalendarIcon from './../assets/images/others/calendar.svg';

const {width, height} = Dimensions.get('window');

const ImageDiary = ({
  onPress,
  editable = true,
  initialContent = '',
  initialImage = null,
  initialDate = null,
}) => {
  /* Default: 오늘 날짜 */
  const today = new Date();
  const formattedToday = `${today.getFullYear()}-${String(
    today.getMonth() + 1,
  ).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const [contents, setContents] = useState(initialContent);
  const [selectedDate, setSelectedDate] = useState(
    initialDate || formattedToday,
  );
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [diaryImage, setDiaryImage] = useState(initialImage);

  useEffect(() => {
    setContents(initialContent);
  }, [initialContent]);

  useEffect(() => {
    setDiaryImage(initialImage);
  }, [initialImage]);

  useEffect(() => {
    if (initialDate) setSelectedDate(initialDate);
  }, [initialDate]);

  const handleChangeImage = () => {
    if (!editable) return;
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (!response.didCancel && !response.errorCode) {
        const uri = response.assets[0].uri;
        setDiaryImage(uri);
      }
    });
  };

  /* 캘린더에서 선택한 날짜 format */
  const getFormattedDate = dateStr => {
    if (!dateStr) return null;

    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // JS는 0부터 시작
    const day = date.getDate();

    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[date.getDay()];

    return {year, month, day, weekday};
  };

  const formatted = getFormattedDate(selectedDate); // { year, month, day, weekday }

  return (
    <DiaryContainer source={PaperImage}>
      <PinImage width={width * 0.86} height={width * 0.065} />
      <ContentsContainer>
        <ContentsWrapper>
          <TitleWrapper>
            {editable && ( // 캘린더 버튼은 editable일 때만
              <CalendarIconButton onPress={() => setIsCalendarVisible(true)}>
                <CalendarIcon width={width * 0.06} height={width * 0.06} />
              </CalendarIconButton>
            )}

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
          </TitleWrapper>
          <ImagePickerButton onPress={handleChangeImage}>
            {diaryImage ? (
              <Image
                source={{uri: diaryImage}}
                style={{
                  width: '100%',
                  height: '100%',
                }}
              />
            ) : (
              <DiaryImage width={width * 0.08} height={width * 0.08} />
            )}
          </ImagePickerButton>
          {editable ? (
            <WritingArea
              value={contents}
              onChangeText={setContents}
              multiline
              placeholder="갤러리를 정리하며 꼭 기억하고 싶은 순간이 담긴 사진과 함께 그 날 있었던 일에 대해 기록해보세요."
            />
          ) : (
            <ReadOnlyText>{contents || '작성된 내용이 없습니다.'}</ReadOnlyText>
          )}
        </ContentsWrapper>
        {editable && (
          <SaveButton
            contents={contents}
            onPress={onPress}
            imageUri={diaryImage}
          />
        )}
      </ContentsContainer>
      {isCalendarVisible && (
        <CalendarContainer>
          <Calendar
            style={{backgroundColor: 'transparent'}}
            monthFormat={'yyyy년 MM월'}
            onDayPress={day => {
              setSelectedDate(day.dateString); // '2025-04-02'
              setIsCalendarVisible(false);
            }}
            value={selectedDate}
            theme={{
              calendarBackground: 'transparent',
              backgroundColor: 'transparent',
              todayBackgroundColor: colors.yellow,
              arrowColor: colors.yellow,
              todayTextColor: colors.brown,
              dayTextColor: colors.brown,
              monthTextColor: colors.brown,
              textSectionTitleColor: colors.brown,
              textDisabledColor: colors.gray200,
              selectedDayBackgroundColor: colors.yellow,
            }}
          />
        </CalendarContainer>
      )}
    </DiaryContainer>
  );
};

const SaveButton = ({contents, onPress, imageUri}) => {
  return (
    <BrwonPressable
      onPress={() => {
        onPress?.({
          contents: contents,
          imageUri: imageUri,
        });
      }}>
      <SaveText>저장</SaveText>
    </BrwonPressable>
  );
};

const BrwonPressable = styled.Pressable`
  width: fit-content;
  background-color: ${colors.brown};
  border-radius: 24px;
  padding: 4px 18px;
  align-items: center;
`;

const SaveText = styled.Text`
  color: ${colors.white};
  font-family: 'NPSfont_bold';
`;

const DiaryContainer = styled.ImageBackground`
  flex: 1;
  border-radius: 6px;
  border: 1px ${colors.black} solid;
`;

const ContentsContainer = styled.View`
  flex: 1;
  align-items: flex-end;
  flex-direction: column;
  padding: ${width * 0.06}px;
  gap: 16px;
`;

const ContentsWrapper = styled.View`
  width: 100%;
  flex: 1;
  align-items: flex-start;
  gap: 12px;
`;

const CalendarIconButton = styled.TouchableOpacity``;

const CalendarContainer = styled.View`
  position: absolute;
  top: ${height * 0.09}px;
  left: ${width * 0.04}px;
  width: 90%;
  border-radius: 20px;
  padding: 8px;
  background-color: ${colors.white};
`;

const TitleWrapper = styled.View`
  width: 100%;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  gap: 16px;
`;

const ImagePickerButton = styled.TouchableOpacity`
  width: 100%;
  height: 28%;
  background-color: ${colors.white};
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  overflow: hidden;
`;

const WritingArea = styled.TextInput`
  flex: 1;
  text-align: left;
  text-align-vertical: top;
  font-family: 'KyoboHandwriting2019';
  font-size: ${width * 0.04}px;
  placeholder-text-color: ${colors.gray300};
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

const ReadOnlyText = styled(WritingText)`
  margin-top: 16px;
  line-height: 26px;
  color: ${colors.brown};
`;

export default ImageDiary;
