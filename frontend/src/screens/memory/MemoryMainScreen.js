import React, {useState, useEffect} from 'react';
import {Dimensions, Modal} from 'react-native';
import styled from 'styled-components/native';
import colors from '../../constants/colors';
import ContentsBox from '../../components/ContentsBox';
import AnimalIdle from './AnimalIdle';
import MemoryCalendar from './MemoryCalendar';

import {get} from '../../services/api';
import config from '../../constants/config';

const {width, height} = Dimensions.get('window');

const MemoryMainScreen = ({navigation, route}) => {
  const {petId, petCase, color} = route.params;
  const bgImage = require('./../../assets/images/backgrounds/bg_blossom.png');

  const today = new Date();

  const [remindMessage, setRemindMessage] = useState('');
  const [emotionData, setEmotionData] = useState({});
  const [remindData, setRemindData] = useState([]);
  const [recordData, setRecordData] = useState([]);

  useEffect(() => {
    const fetchWeekData = async () => {
      try {
        const res = await get(config.RECOLLECTION.WEEK(petId));
        const result = res.result;

        const emotionMap = {};
        const remindList = [];
        const recordList = [];

        result.forEach(entry => {
          if (entry.recordEmotion) {
            emotionMap[entry.day] = entry.recordEmotion.toLowerCase();
          }
          if (entry.didRemind) {
            remindList.push(entry.day);
          }
          if (entry.didRecord) {
            recordList.push(entry.day);
          }
        });

        setEmotionData(emotionMap);
        setRemindData(remindList);
        setRecordData(recordList);
      } catch (err) {
        console.error('주간 데이터 불러오기 실패:', err);
      }
    };

    fetchWeekData();
  }, []);

  useEffect(() => {
    const fetchRemindMessage = async () => {
      try {
        const res = await get(`${config.AI.REMIND_MESSAGE}?p_id=${petId}`);
        if (res.is_Sucess) {
          setRemindMessage(res.result);
        } else {
          console.warn('리마인드 메시지 실패:', res.message);
        }
      } catch (e) {
        console.error('리마인드 메시지 에러:', e);
      }
    };

    fetchRemindMessage();
  }, [petId]);

  const handleRecordPress = async () => {
    try {
      const res = await get(config.RECOLLECTION.TODAY(petId));
      const recordId = res.result?.recordId;

      navigation.navigate('MemoryStackNavigator', {
        screen: 'RecordScreen',
        params: {petId, recordId},
      });
    } catch (e) {
      console.error('오늘 기록 조회 실패:', e);
    }
  };

  const handleRemindPress = async () => {
    try {
      const res = await get(config.RECOLLECTION.TODAY(petId));
      const remindId = res.result?.remindId;

      navigation.navigate('MemoryStackNavigator', {
        screen: 'RemindScreen',
        params: {petId, petCase, color, remindId, remindMessage},
      });
    } catch (e) {
      console.error('오늘 기록 조회 실패:', e);
    }
  };

  return (
    <Container>
      <BgImage source={bgImage}>
        <CalendarWrapper>
          <MemoryCalendar
            selectedDate={today}
            emotionData={emotionData}
            remindData={remindData}
            recordData={recordData}
            onSelectDate={date => console.log('날짜 선택:', date)}
          />
        </CalendarWrapper>

        <BoxContainer>
          <ContentsBox
            iconName="remind"
            iconText="REMIND"
            contentsText={remindMessage}
            onPress={handleRemindPress}
          />

          <ContentsBox
            iconName="record"
            iconText="RECORD"
            contentsText="오늘 나와 있었던 일에 대해 기록해줘!"
            onPress={handleRecordPress}
          />
        </BoxContainer>

        <AnimalIdle animalType={petCase} animalColor={color} />
      </BgImage>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: ${colors.white};
  padding: ${height * 0.02}px 0 0 0;
`;

const BgImage = styled.ImageBackground`
  flex: 1;
  width: 100%;
  height: 100%;
  align-items: center;
`;

const CalendarWrapper = styled.View`
  width: 100%;
  padding: 0 8px;
`;

const BoxContainer = styled.View`
  gap: ${height * 0.02}px;
`;

export default MemoryMainScreen;
