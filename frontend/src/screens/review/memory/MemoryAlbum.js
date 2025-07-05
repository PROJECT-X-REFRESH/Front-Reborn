import React, {useState, useEffect} from 'react';
import {Dimensions, FlatList, ScrollView, Image} from 'react-native';
import styled from 'styled-components/native';
import colors from '../../../constants/colors';
import {NpsText} from '../../../components/CustomText';

import RightArrow from '../../../assets/images/others/right_arrow.svg';
import RemindFramePng from '../../../assets/images/others/frame_remind.png';
import RecordFramePng from '../../../assets/images/others/frame_record.png';

import {get} from '../../../services/api';
import config from '../../../constants/config';

const {width, height} = Dimensions.get('window');

const formatDateToKorean = isoString => {
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const date = new Date(isoString);
  return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(
    2,
    '0',
  )}월 ${String(date.getDate()).padStart(2, '0')}일 ${
    weekdays[date.getDay()]
  }요일`;
};

const MemoryAlbum = ({navigation, route}) => {
  const [remindList, setRemindList] = useState([]);
  const [recordList, setRecordList] = useState([]);
  const {petId, name, petCase, color} = route.params;
  const scrollPosition = 0;
  const fetchSize = 20;

  useEffect(() => {
    const fetchRemindList = async () => {
      try {
        const res = await get(
          config.REMIND.LIST(petId, scrollPosition, fetchSize),
        );
        setRemindList(res.result);
      } catch (e) {
        console.error('Remind 목록 불러오기 실패:', e);
      }
    };

    const fetchRecordList = async () => {
      try {
        const res = await get(
          config.RECORD.LIST(petId, scrollPosition, fetchSize),
        );
        setRecordList(res.result);
      } catch (e) {
        console.error('Record 목록 불러오기 실패:', e);
      }
    };

    fetchRemindList();
    fetchRecordList();
  }, []);

  return (
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{flexGrow: 1}}>
      {/* REMIND */}
      <Page style={{paddingLeft: width * 0.06, paddingRight: 0}}>
        <FrameWrapper style={{alignItems: 'flex-end'}}>
          <Image
            source={RemindFramePng}
            style={{
              width: width * 0.94,
              height: height * 0.76,
              position: 'absolute',
              resizeMode: 'stretch',
            }}
          />
          <LeftContent>
            <SectionTitle>
              <Eng>
                <Yellow>RE</Yellow>MIND
              </Eng>
              <Kor> 반려동물과 대화하기</Kor>
            </SectionTitle>

            <ScrollList
              data={remindList}
              keyExtractor={(item, index) => `remind-${index}`}
              renderItem={({item}) => (
                <Item
                  onPress={() =>
                    navigation.navigate('RemindScreen', {
                      petCase: petCase,
                      color: color,
                      remindId: item.id,
                    })
                  }>
                  <ItemContent>
                    <ItemText>{item.title}</ItemText>
                    <RightArrow width={16} height={16} />
                  </ItemContent>
                </Item>
              )}
              showsVerticalScrollIndicator={false}
            />
          </LeftContent>
        </FrameWrapper>
      </Page>

      {/* RECORD */}
      <Page style={{paddingRight: width * 0.06, paddingLeft: 0}}>
        <FrameWrapper style={{alignItems: 'flex-start'}}>
          <Image
            source={RecordFramePng}
            style={{
              width: width * 0.94,
              height: height * 0.76,
              position: 'absolute',
              resizeMode: 'stretch',
            }}
          />
          <RightContent>
            <SectionTitle>
              <Eng>
                <Yellow>RE</Yellow>CORD
              </Eng>
              <Kor> 반려일기 작성하기</Kor>
            </SectionTitle>

            <ScrollList
              data={recordList}
              keyExtractor={(item, index) => `record-${index}`}
              renderItem={({item}) => (
                <Item
                  onPress={() =>
                    navigation.navigate('RecordScreen', {
                      recordId: item.id,
                    })
                  }>
                  <ItemContent>
                    <ItemText>{formatDateToKorean(item.createdAt)}</ItemText>
                    <RightArrow width={16} height={16} />
                  </ItemContent>
                </Item>
              )}
              showsVerticalScrollIndicator={false}
            />
          </RightContent>
        </FrameWrapper>
      </Page>
    </ScrollView>
  );
};

export default MemoryAlbum;

const Page = styled.View`
  width: ${width}px;
  padding: ${height * 0.03}px 0;
  background-color: ${colors.white};
`;

const FrameWrapper = styled.View`
  width: 100%;
  position: relative;
`;

const LeftContent = styled.View`
  position: absolute;
  top: ${height * 0.045}px;
  left: ${width * 0.1}px;
`;

const RightContent = styled.View`
  position: absolute;
  top: ${height * 0.045}px;
  left: ${width * 0.18}px;
`;

const SectionTitle = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${height * 0.02}px;
`;

const Eng = styled.Text`
  font-size: ${width * 0.045}px;
  font-family: 'NPSfont_extrabold';
  color: ${colors.brown};
`;

const Kor = styled(NpsText)`
  font-size: ${width * 0.034}px;
  margin-left: ${width * 0.01}px;
`;

const Yellow = styled.Text`
  color: ${colors.yellow};
`;

const ScrollList = styled(FlatList)`
  max-height: ${height * 0.63}px;
`;

const Item = styled.TouchableOpacity`
  padding: ${height * 0.02}px 0;
  border-bottom-width: 1px;
  border-color: ${colors.gray200};
`;

const ItemContent = styled.View`
  flex-direction: row;
  align-items: center;
  width: ${width * 0.67}px;
  justify-content: space-between;
`;

const ItemText = styled(NpsText)`
  font-size: ${width * 0.038}px;
  color: ${colors.brown};
`;
