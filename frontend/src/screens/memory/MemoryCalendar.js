import React, {useState, useEffect} from 'react';
import {TouchableOpacity, Dimensions} from 'react-native';
import {NpsBText, NpsText} from '../../components/CustomText';
import styled from 'styled-components/native';
import CalendarIcon from '../../assets/images/others/calendar.svg';
import SunIcon from '../../assets/images/others/sun.svg';
import CloudIcon from '../../assets/images/others/cloud.svg';
import RainIcon from '../../assets/images/others/rain.svg';
import colors from '../../constants/colors';

const {width, height} = Dimensions.get('window');

const MemoryCalendar = ({
  selectedDate,
  emotionData,
  remindData,
  recordData,
  onSelectDate,
}) => {
  const [currentWeek, setCurrentWeek] = useState([]);

  useEffect(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const allWeeks = getWeeksOfMonth(year, month);
    const today = selectedDate.getDate();

    for (let i = 0; i < allWeeks.length; i++) {
      const week = allWeeks[i];
      if (week.some(d => d && d.getDate() === today)) {
        setCurrentWeek(week);
        break;
      }
    }
  }, [selectedDate]);

  const renderWeatherIcon = dateStr => {
    const weather = emotionData[dateStr];
    if (!weather) return null;
    if (weather === 'sun') return <SunIcon width={14} height={14} />;
    if (weather === 'cloud') return <CloudIcon width={14} height={14} />;
    if (weather === 'rain') return <RainIcon width={14} height={14} />;
    return null;
  };

  const isToday = date => {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  const formatDate = date => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0',
    )}-${String(date.getDate()).padStart(2, '0')}`;
  };

  return (
    <CalendarContainer>
      <Header>
        <CalendarIcon width={20} height={20} />
        <HeaderText>
          {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월
        </HeaderText>
      </Header>

      <WeekDays>
        {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
          <WeekDay key={idx} dayIndex={idx}>
            {day}
          </WeekDay>
        ))}
      </WeekDays>

      <WeekRow>
        {currentWeek.map((date, i) => {
          const dateStr = date ? formatDate(date) : null;
          return (
            <DateCell key={i}>
              <WeatherWrapper>
                {dateStr && renderWeatherIcon(dateStr)}
              </WeatherWrapper>
              <TouchableOpacity
                onPress={() => date && onSelectDate(date)}
                disabled={!date}>
                <DateCircle isToday={date && isToday(date)}>
                  <DateText isToday={date && isToday(date)} dayIndex={i}>
                    {date ? date.getDate() : ''}
                  </DateText>
                </DateCircle>
              </TouchableOpacity>
              {dateStr && remindData.includes(dateStr) && <Dot />}
            </DateCell>
          );
        })}
      </WeekRow>
    </CalendarContainer>
  );
};

function getWeeksOfMonth(year, month) {
  const weeks = [];
  let week = [];

  const firstDay = new Date(year, month, 1);
  const startDayOfWeek = firstDay.getDay(); // 0 (일) ~ 6 (토)

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // 이전 달 날짜 채우기 (정확하게 "빈칸"을 null로 넣는 게 더 명확)
  for (let i = 0; i < startDayOfWeek; i++) {
    week.push(null);
  }

  // 이번 달 날짜 채우기
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    week.push(date);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }

  // 마지막 주가 7일이 안 되면 빈 칸(null)으로 채움
  if (week.length > 0) {
    while (week.length < 7) {
      week.push(null);
    }
    weeks.push(week);
  }

  return weeks;
}

const CalendarContainer = styled.View`
  margin: 20px;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 24px;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 14px 0;
`;

const HeaderText = styled(NpsBText)`
  font-size: ${width * 0.038}px;
  color: ${colors.brown};
  margin-left: 12px;
`;

const WeekDays = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const WeekDay = styled(NpsBText)`
  width: 32px;
  text-align: center;
  color: ${({dayIndex}) =>
    dayIndex === 0 ? colors.red : dayIndex === 6 ? colors.blue : colors.brown};
`;

const WeekRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const DateCell = styled.View`
  align-items: center;
  width: 32px;
`;

const WeatherWrapper = styled.View`
  height: 18px;
`;

const DateCircle = styled.View`
  background-color: ${({isToday}) => (isToday ? colors.yellow : 'transparent')};
  border-radius: 100px;
  padding: 6px;
  width: 30px;
  height: 30px;
`;

const DateText = styled(NpsText)`
  text-align: center;
  color: ${({isToday, dayIndex}) => {
    if (isToday) {
      if (dayIndex === 0) return colors.red;
      if (dayIndex === 6) return colors.blue;
      return colors.brown;
    }
    if (dayIndex === 0) return colors.red;
    if (dayIndex === 6) return colors.blue;
    return colors.brown;
  }};
`;

const Dot = styled.View`
  width: 6px;
  height: 6px;
  background-color: ${colors.yellow};
  border-radius: 6px;
  margin-top: 10px;
`;

export default MemoryCalendar;
