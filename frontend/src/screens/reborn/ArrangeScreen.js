/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useRef, useState, useEffect, useCallback, useMemo} from 'react';
import {Animated, PanResponder, Dimensions, Modal} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import styled from 'styled-components/native';
import colors from './../../constants/colors';
import ToastMessage from '../../components/ToastMessage';
import {useReborn} from './../../context/RebornContext';
import {get, patch} from '../../services/api';
import config from '../../constants/config';

const {width, height} = Dimensions.get('window');

const bgImage = require('./../../assets/images/backgrounds/bg_arrangement.png');
const boxImage = require('./../../assets/images/pets/dog/others/dog_box.png');

const ArrangeScreen = ({navigation}) => {
  const {setIsContents2, farewellId, petCase} = useReborn();

  const [count, setCount] = useState(0);
  const [arrangedData, setArrangedData] = useState(null);
  const [hiddenItems, setHiddenItems] = useState({});
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const boxLayout = useRef(null);

  const itemSources = [
    {
      id: 'snack',
      image:
        petCase === 'CAT'
          ? require('./../../assets/images/pets/cat/others/cat_snack.png')
          : require('./../../assets/images/pets/dog/others/dog_snack.png'),
      pos: {xRatio: 0.4, yRatio: 0.04},
    },
    {
      id: 'toy',
      image:
        petCase === 'CAT'
          ? require('./../../assets/images/pets/cat/others/cat_stick.png')
          : require('./../../assets/images/pets/dog/others/dog_toy.png'),
      pos: {xRatio: 0.65, yRatio: 0.65},
    },
    {
      id: 'bath',
      image:
        petCase === 'CAT'
          ? require('./../../assets/images/pets/cat/others/cat_bath.png')
          : require('./../../assets/images/pets/dog/others/dog_bath.png'),
      pos: {xRatio: 0.15, yRatio: 0.35},
    },
    {
      id: 'living',
      image:
        petCase === 'CAT'
          ? require('./../../assets/images/pets/cat/others/cat_tower.png')
          : require('./../../assets/images/pets/dog/others/dog_cushion.png'),
      pos:
        petCase === 'CAT'
          ? {xRatio: 0.55, yRatio: 0.2}
          : {xRatio: 0.65, yRatio: 0.38},
    },
  ];

  // 1) focus 시 초기화 및 서버에서 정리 상태 가져오기
  useFocusEffect(
    useCallback(() => {
      setCount(0);
      setHiddenItems({});
      setShowToast(false);
      // don't reset arrangedData here, preserve until fetched

      let active = true;
      (async () => {
        try {
          const res = await get(config.REMEMBER.CLEAN_VIEW(farewellId));
          if (active) setArrangedData(res.result);
        } catch (e) {
          console.error('fetchArrange error:', e);
        }
      })();
      return () => {
        active = false;
      };
    }, [farewellId]),
  );

  // 2) count 변화 시 토스트 + 화면 이동
  useEffect(() => {
    if (count < 2) return;
    setShowToast(true);
    const t = setTimeout(() => {
      setShowToast(false);
      setIsContents2(true);
      navigation.navigate('RebornStackNavigator', {screen: 'RebornMainScreen'});
    }, 3500);
    return () => clearTimeout(t);
  }, [count, navigation, setIsContents2]);

  // 3) 서버 업데이트
  const handleItemDropped = useCallback(
    async id => {
      try {
        await patch(config.REMEMBER.CLEAN(farewellId, id.toUpperCase()));
      } catch (e) {
        console.error(`"${id}" 정리 상태 업데이트 실패:`, e);
      }
    },
    [farewellId],
  );

  // 4) PanResponder + 애니메이션
  const createPan = useCallback(
    id => {
      const pan = new Animated.ValueXY({x: 0, y: 0});
      const responder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: Animated.event([null, {dx: pan.x, dy: pan.y}], {
          useNativeDriver: false,
        }),
        onPanResponderRelease: (_, g) => {
          if (!boxLayout.current) {
            Animated.spring(pan, {
              toValue: {x: 0, y: 0},
              useNativeDriver: false,
            }).start();
            return;
          }
          const {x, y, width: w, height: h} = boxLayout.current;
          const inside =
            g.moveX >= x &&
            g.moveX <= x + w &&
            g.moveY >= y &&
            g.moveY <= y + h;
          if (inside && !hiddenItems[id] && !arrangedData?.[id]) {
            setHiddenItems(h => ({...h, [id]: true}));
            setCount(c => c + 1);
            handleItemDropped(id);
          } else {
            Animated.spring(pan, {
              toValue: {x: 0, y: 0},
              useNativeDriver: false,
            }).start();
          }
        },
      });
      return {pan, responder};
    },
    [hiddenItems, arrangedData, handleItemDropped],
  );

  // 5) arrangedData가 로드된 후에만 필터링하여 렌더
  const availableItems = useMemo(() => {
    if (arrangedData === null) return []; // still loading → render nothing (avoids flicker)
    return itemSources.filter(({id}) => !hiddenItems[id] && !arrangedData[id]);
  }, [hiddenItems, arrangedData]);

  return (
    <Container>
      <BgImage source={bgImage}>
        <BoxImage
          source={boxImage}
          onLayout={e => {
            boxLayout.current = e.nativeEvent.layout;
          }}
        />

        {availableItems.map(({id, image, pos}) => {
          const {pan, responder} = createPan(id);
          const isCatTower = id === 'living' && petCase === 'CAT';

          return (
            <Animated.View
              key={id}
              style={{
                position: 'absolute',
                left: pos.xRatio * width,
                top: pos.yRatio * height,
                transform: pan.getTranslateTransform(),
              }}
              {...responder.panHandlers}>
              <ItemImage
                source={image}
                isLarge={isCatTower} // 여기서만 크게!
                resizeMode="contain"
              />
            </Animated.View>
          );
        })}

        {isInfoVisible && (
          <Modal transparent statusBarTranslucent animationType="slide" visible>
            <BlackOverlay onPress={() => setIsInfoVisible(false)}>
              <InfoBox>
                <InfoTitle>
                  <YellowTitle>RE</YellowTitle>MEMBER 정리하기 가이드
                </InfoTitle>
                <InfoText>
                  1. 하루에 두 가지 물품을 정리합니다.{'\n'}
                  2. 정리한 물품을 박스에 드래그합니다.{'\n'}
                  3. 순서가 고민되면 카테고리별로 정리하세요.
                </InfoText>
              </InfoBox>
            </BlackOverlay>
          </Modal>
        )}

        {showToast && (
          <ToastMessage
            message="정리 완료! 수고하셨습니다."
            onHide={() => setShowToast(false)}
          />
        )}
      </BgImage>
    </Container>
  );
};

export default ArrangeScreen;

// ===== STYLES =====
const Container = styled.View`
  flex: 1;
  background-color: ${colors.white};
  padding-top: ${height * 0.02}px;
`;
const BgImage = styled.ImageBackground`
  flex: 1;
  width: 100%;
  height: 100%;
`;
const BoxImage = styled.Image`
  width: ${width * 0.35}px;
  height: ${width * 0.35}px;
  position: absolute;
  bottom: ${height * 0.1}px;
  left: ${width * 0.1}px;
`;
const ItemImage = styled.Image`
  width: ${props => (props.isLarge ? width * 0.4 : width * 0.24)}px;
  height: ${props => (props.isLarge ? width * 0.7 : width * 0.24)}px;
`;

const BlackOverlay = styled.Pressable`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.25);
  justify-content: center;
  align-items: center;
`;
const InfoBox = styled.View`
  width: ${width * 0.8}px;
  background-color: ${colors.white};
  padding: ${width * 0.1}px ${width * 0.074}px;
  border-radius: 20px;
  gap: 20px;
`;
const InfoTitle = styled.Text`
  font-family: 'NPSfont_extrabold';
  color: ${colors.brown};
  font-size: ${width * 0.04}px;
  text-align: center;
`;
const YellowTitle = styled.Text`
  color: ${colors.yellow};
`;
const InfoText = styled.Text`
  font-family: 'NpsText';
  font-size: ${width * 0.035}px;
  line-height: ${width * 0.074}px;
  text-align: left;
`;
