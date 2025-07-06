import React, {useState, useEffect, useContext} from 'react';
import {NpsBText} from '../../components/CustomText';
import {CommonActions} from '@react-navigation/native';
import {Image, Dimensions} from 'react-native';
import styled from 'styled-components';
import colors from '../../constants/colors';
import AnimalImages from '../../components/AnimalImages';
import BookmarkYellow from '../../assets/images/others/bookmark_yellow.svg';
import BookmarkBlack from '../../assets/images/others/bookmark_black.svg';
import RibbonIcon from '../../assets/images/others/ribbon_black.svg';
import {PetContext} from '../../context/PetContext';
import {get} from '../../services/api';
import config from '../../constants/config';

const {width, height} = Dimensions.get('window');

const ReviewHome = ({navigation}) => {
  const {petId} = useContext(PetContext);
  const [petInfo, setPetInfo] = useState(null);
  const [hasMemory, setHasMemory] = useState(false);

  useEffect(() => {
    setPetInfo(null);
    setHasMemory(false);

    const fetchPetInfo = async () => {
      try {
        const res = await get(config.FAREWELL.REVIEW_CARD(0, petId)); // 0은 dummy farewellId
        setPetInfo(res.result);
        console.log(res.result);
      } catch (err) {
        console.error('리뷰용 펫 정보 불러오기 실패:', err);
      }
    };

    const checkMemory = async () => {
      try {
        const res = await get(config.RECOLLECTION.ID(petId));
        if (res.result !== undefined && res.result !== null) {
          setHasMemory(true);
        }
      } catch (err) {
        console.log('추억 앨범 없음 또는 오류:', err.message);
      }
    };

    if (petId) {
      fetchPetInfo();
      checkMemory();
    }
  }, [petId]);

  if (!petInfo) return null;

  const {name, petCase, color, death, farewellId} = petInfo;
  const profileImg = AnimalImages[petCase]?.[color]?.profile;

  return (
    <Container>
      <Header>
        <Title>
          <Yellow>RE</Yellow>VIEW
        </Title>
      </Header>
      {!hasMemory && !death && (
        <NoAlbumContainer>
          <NoAlbumText>
            아직은 앨범이 없어요.{'\n'}반려동물과의 이야기를 시작해보세요.
          </NoAlbumText>
        </NoAlbumContainer>
      )}

      {hasMemory && (
        <AlbumCard
          onPress={() =>
            navigation.dispatch(
              CommonActions.navigate({
                name: 'ReviewStackNavigator',
                params: {
                  screen: 'MemoryAlbum',
                  params: {petId, name, petCase, color},
                },
              }),
            )
          }>
          <ContentRow>
            <TextArea>
              <MainTitle>
                {name}
                {'\n'}추억 앨범
              </MainTitle>
              <SubText>
                <Yellow>RE</Yellow>MIND{'\n'}
                <Yellow>RE</Yellow>CORD
              </SubText>
            </TextArea>

            <RightGroup>
              <RibbonOffset>
                <BookmarkYellow
                  width={width * 0.1}
                  height={width * 0.1 * 1.34}
                />
              </RibbonOffset>
              <Image
                source={profileImg}
                style={{
                  width: width * 0.25,
                  height: width * 0.25,
                  borderRadius: 5,
                }}
              />
            </RightGroup>
          </ContentRow>
        </AlbumCard>
      )}

      {death && (
        <AlbumCard
          onPress={() =>
            navigation.dispatch(
              CommonActions.navigate({
                name: 'ReviewStackNavigator',
                params: {
                  screen: 'GoodByeAlbum',
                  params: {farewellId, name},
                },
              }),
            )
          }>
          <ContentRow>
            <TextArea>
              <MainTitleContainer>
                <TitleRow>
                  <MainTitleText>{name}</MainTitleText>
                  <RibbonInline />
                </TitleRow>
                <MainTitleText>작별 앨범</MainTitleText>
              </MainTitleContainer>
              <SubText>
                <Yellow>RE</Yellow>COGNIZE{'\n'}
                <Yellow>RE</Yellow>VEAL{'\n'}
                <Yellow>RE</Yellow>MEMBER{'\n'}
                <Yellow>RE</Yellow>BIRTH
              </SubText>
            </TextArea>

            <RightGroup>
              <RibbonOffset>
                <BookmarkBlack
                  width={width * 0.1}
                  height={width * 0.1 * 1.34}
                />
              </RibbonOffset>
              <Image
                source={profileImg}
                style={{
                  width: width * 0.25,
                  height: width * 0.25,
                  borderRadius: 5,
                }}
              />
            </RightGroup>
          </ContentRow>
        </AlbumCard>
      )}
    </Container>
  );
};

export default ReviewHome;

const Container = styled.View`
  flex: 1;
  background-color: ${colors.white};
  padding: ${height * 0.02}px ${width * 0.06}px;
`;

const Header = styled.View`
  align-items: center;
  margin: ${height * 0.06}px 0 ${height * 0.02}px 0;
`;

const Title = styled.Text`
  font-size: ${width * 0.045}px;
  font-family: 'NPSfont_extrabold';
  color: ${colors.brown};
  flex-direction: row;
`;

const Yellow = styled.Text`
  color: ${colors.yellow};
`;

const NoAlbumContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const NoAlbumText = styled.Text`
  font-size: ${width * 0.04}px;
  color: ${colors.brown};
  text-align: center;
  line-height: ${width * 0.08}px;
  font-family: 'NPSfont_regular';
`;

const AlbumCard = styled.TouchableOpacity`
  width: 100%;
  background-color: ${colors.white};
  border-radius: 24px;
  padding: ${height * 0.045}px;
  margin: ${height * 0.02}px 0;
  align-items: stretch;
  border: 3px solid ${colors.gray200};
  flex-direction: row;
  position: relative;
`;

const TextArea = styled.View`
  flex: 1;
  justify-content: space-between;
`;

const MainTitle = styled.Text`
  font-size: ${width * 0.06}px;
  font-family: 'NPSfont_extrabold';
  margin-bottom: ${height * 0.03}px;
  line-height: ${width * 0.08}px;
  color: ${colors.brown};
`;

const MainTitleContainer = styled.View`
  flex-direction: column;
  margin-bottom: ${height * 0.03}px;
`;

const TitleRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const MainTitleText = styled.Text`
  font-size: ${width * 0.06}px;
  font-family: 'NPSfont_extrabold';
  color: ${colors.brown};
  line-height: ${width * 0.08}px;
`;

const RibbonInline = styled(RibbonIcon)`
  width: ${width * 0.04}px;
  height: ${width * 0.04}px;
  margin-left: ${width * 0.01}px;
  align-items: center;
`;

const SubText = styled(NpsBText)`
  font-size: ${width * 0.04}px;
  color: ${colors.brown};
  line-height: ${width * 0.065}px;
`;

const ContentRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  width: 100%;
`;

const RightGroup = styled.View`
  width: 100px;
  align-items: flex-end;
  justify-content: flex-start;
  flex-direction: column;
`;

const RibbonOffset = styled.View`
  margin-top: ${-height * 0.05}px;
  margin-bottom: ${height * 0.09}px;
`;
