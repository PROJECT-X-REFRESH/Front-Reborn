import React, {useState, useEffect} from 'react';
import {Dimensions, Image} from 'react-native';
import styled from 'styled-components/native';
import colors from '../../../constants/colors';
import {NpsText} from '../../../components/CustomText';

import recogFrameImg from '../../../assets/images/others/frame_recog.png';
import revealFrameImg from '../../../assets/images/others/frame_reveal.png';
import rememberFrameImg from '../../../assets/images/others/frame_remember.png';
import rebirthFrameImg from '../../../assets/images/others/frame_rebirth.png';
import RightArrow from '../../../assets/images/others/right_arrow.svg';

import {get} from '../../../services/api';
import config from '../../../constants/config';

const {width, height} = Dimensions.get('window');

const GoodByeAlbum = ({navigation, route}) => {
  const {farewellId, name} = route.params;

  const [recognizeDone, setRecognizeDone] = useState(false);
  const [recognizeId, setRecognizeId] = useState(null);
  const [revealItems, setRevealItems] = useState([]);
  const [rememberItems, setRememberItems] = useState([]);
  const [rebirthItems, setRebirthItems] = useState([]);

  useEffect(() => {
    const fetchGoodbyeAlbum = async () => {
      try {
        const res = await get(config.FAREWELL.REVIEW_ALL(farewellId));
        const result = res.result;

        const recognize = result.recognize;

        const recognizeValid = recognize?.id && recognize.id !== 0;
        setRecognizeDone(recognizeValid);
        setRecognizeId(recognize?.id);

        const reveal = result.revealList.map((item, idx) => ({
          id: item.id,
          label: `감정 일기 DAY ${idx + 1}`,
        }));
        const remember = result.rememberList.map((item, idx) => ({
          id: item.id,
          label: `사진 일기 DAY ${idx + 1}`,
        }));
        const rebirth = result.rebirth?.id
          ? [{id: result.rebirth.id, label: `편지 from. ${name}`}]
          : [];

        setRevealItems(reveal);
        setRememberItems(remember);
        setRebirthItems(rebirth);
      } catch (err) {
        console.error('작별 앨범 조회 실패:', err);
      }
    };

    fetchGoodbyeAlbum();
  }, [farewellId]);

  return (
    <Container>
      {/* RECOGNIZE */}
      <FrameBox>
        <FrameImage
          source={recogFrameImg}
          resizeMode="stretch"
          frameHeight={height * 0.13}
        />
        <ContentOverlay>
          <SectionTitle>
            <Eng>
              <Yellow>RE</Yellow>COGNIZE
            </Eng>
            <Kor> 나의 상태 알아보기</Kor>
          </SectionTitle>
          {recognizeDone ? (
            <TouchableItem
              onPress={() =>
                navigation.navigate('RecognizeScreen', {
                  id: recognizeId,
                })
              }
              isLast>
              <ItemContent>
                <ItemText>펫로스 증후군 자가진단 결과</ItemText>
                <RightArrow width={16} height={16} />
              </ItemContent>
            </TouchableItem>
          ) : (
            <EmptyWrapper heightVal={height * 0.06}>
              <EmptyText>나의 상태를 알아보세요.</EmptyText>
            </EmptyWrapper>
          )}
        </ContentOverlay>
      </FrameBox>

      {/* REVEAL */}
      <FrameBox>
        <FrameImage
          source={revealFrameImg}
          resizeMode="stretch"
          frameHeight={height * 0.245}
        />
        <ContentOverlay>
          <SectionTitle>
            <Eng>
              <Yellow>RE</Yellow>VEAL
            </Eng>
            <Kor> 나의 감정 드러내기</Kor>
          </SectionTitle>
          {revealItems.length > 0 ? (
            revealItems.map((item, idx) => (
              <TouchableItem
                key={item.id}
                onPress={() =>
                  navigation.navigate('RevealScreen', {id: item.id})
                }
                isLast={idx === revealItems.length - 1}>
                <ItemContent>
                  <ItemText>{item.label}</ItemText>
                  <RightArrow width={16} height={16} />
                </ItemContent>
              </TouchableItem>
            ))
          ) : (
            <EmptyWrapper heightVal={height * 0.16}>
              <EmptyText>나의 감정을 드러내 보세요.</EmptyText>
            </EmptyWrapper>
          )}
        </ContentOverlay>
      </FrameBox>

      {/* REMEMBER */}
      <FrameBox>
        <FrameImage
          source={rememberFrameImg}
          resizeMode="stretch"
          frameHeight={height * 0.185}
        />
        <ContentOverlay>
          <SectionTitle>
            <Eng>
              <Yellow>RE</Yellow>MEMBER
            </Eng>
            <Kor> 반려동물 추억 정리하기</Kor>
          </SectionTitle>
          {rememberItems.length > 0 ? (
            rememberItems.map((item, idx) => (
              <TouchableItem
                key={item.id}
                onPress={() =>
                  navigation.navigate('RememberScreen', {id: item.id})
                }
                isLast={idx === rememberItems.length - 1}>
                <ItemContent>
                  <ItemText>{item.label}</ItemText>
                  <RightArrow width={16} height={16} />
                </ItemContent>
              </TouchableItem>
            ))
          ) : (
            <EmptyWrapper heightVal={height * 0.12}>
              <EmptyText>반려동물과의 추억을 정리해 보세요.</EmptyText>
            </EmptyWrapper>
          )}
        </ContentOverlay>
      </FrameBox>

      {/* REBIRTH */}
      <FrameBox>
        <FrameImage
          source={rebirthFrameImg}
          resizeMode="stretch"
          frameHeight={height * 0.13}
        />
        <ContentOverlay>
          <SectionTitle>
            <Eng>
              <Yellow>RE</Yellow>BIRTH
            </Eng>
            <Kor> 반려동물과 건강한 작별하기</Kor>
          </SectionTitle>
          {rebirthItems.length > 0 ? (
            rebirthItems.map((item, idx) => (
              <TouchableItem
                key={item.id}
                onPress={() =>
                  navigation.navigate('RebirthScreen', {id: item.id})
                }
                isLast={idx === rebirthItems.length - 1}>
                <ItemContent>
                  <ItemText>{item.label}</ItemText>
                  <RightArrow width={16} height={16} />
                </ItemContent>
              </TouchableItem>
            ))
          ) : (
            <EmptyWrapper heightVal={height * 0.06}>
              <EmptyText>반려동물과 건강한 작별을 맞이해 보세요.</EmptyText>
            </EmptyWrapper>
          )}
        </ContentOverlay>
      </FrameBox>
    </Container>
  );
};

export default GoodByeAlbum;

const Container = styled.View`
  flex: 1;
  padding: ${height * 0.03}px 0;
  justify-content: flex-start;
  align-items: flex-start;
  background-color: ${colors.white};
`;

const FrameBox = styled.View`
  width: 100%;
  margin-bottom: ${height * 0.028}px;
  position: relative;
`;

const FrameImage = styled(Image)`
  width: ${width * 0.94}px;
  height: ${({frameHeight}) => frameHeight}px;
`;

const ContentOverlay = styled.View`
  position: absolute;
  top: ${height * 0.026}px;
  left: ${width * 0.13}px;
`;

const SectionTitle = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Eng = styled.Text`
  font-size: ${width * 0.045}px;
  font-family: 'NPSfont_extrabold';
  color: ${colors.brown};
`;

const Yellow = styled.Text`
  color: ${colors.yellow};
`;

const Kor = styled(NpsText)`
  font-size: ${width * 0.034}px;
  margin-left: ${width * 0.01}px;
`;

const TouchableItem = styled.TouchableOpacity`
  padding: ${height * 0.019}px 0;
  border-bottom-width: ${({isLast}) => (isLast ? 0 : 1)}px;
  border-color: ${colors.gray200};
`;

const ItemContent = styled.View`
  flex-direction: row;
  align-items: center;
  width: ${width * 0.74}px;
  justify-content: space-between;
`;

const ItemText = styled(NpsText)`
  font-size: ${width * 0.038}px;
  color: ${colors.brown};
`;

const EmptyWrapper = styled.View`
  width: ${width * 0.74}px;
  height: ${({heightVal}) => heightVal}px;
  justify-content: center;
  align-items: center;
`;

const EmptyText = styled(NpsText)`
  font-size: ${width * 0.038}px;
  color: ${colors.brown};
  text-align: center;
`;
