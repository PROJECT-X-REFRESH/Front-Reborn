import React, {useEffect, useState} from 'react';
import {Dimensions, TouchableOpacity, Alert} from 'react-native';
import {NpsText} from '../../components/CustomText';
import {CommonActions} from '@react-navigation/native';
import * as Keychain from 'react-native-keychain';
import {get, put, del} from '../../services/api';
import config from '../../constants/config';
import styled from 'styled-components/native';
import colors from '../../constants/colors';
import CheckWhiteIcon from '../../assets/images/others/check_white.svg';
import CheckBlackIcon from '../../assets/images/others/check_black.svg';

const {width, height} = Dimensions.get('window');
const iconSize = Math.min(width * 0.06, 30);

const dogColors = [
  colors.black,
  colors.lightBrown,
  colors.ocher,
  colors.gray400,
  colors.white,
];
const catColors = [
  colors.black,
  colors.ocher,
  colors.gray400,
  'halfGray',
  colors.white,
];

const getCheckIcon = selectedColor => {
  return selectedColor === 'halfGray' || selectedColor === '#ffffff' ? (
    <CheckBlackIcon
      width={iconSize}
      height={iconSize}
      style={{position: 'absolute', top: 8, left: 8}}
    />
  ) : (
    <CheckWhiteIcon
      width={iconSize}
      height={iconSize}
      style={{position: 'absolute', top: 8, left: 8}}
    />
  );
};

const PetProfileManage = ({route, navigation}) => {
  const {id} = route.params;

  const [petInfo, setPetInfo] = useState(null);
  const [name, setName] = useState('');
  const [birth, setBirth] = useState('');
  const [death, setDeath] = useState('');
  const [selectedType, setSelectedType] = useState('강아지');
  const [selectedColor, setSelectedColor] = useState(null);

  const colorsToShow = selectedType === '강아지' ? dogColors : catColors;

  useEffect(() => {
    const fetchPetInfo = async () => {
      try {
        const tokenData = await Keychain.getGenericPassword();
        const token = tokenData?.password;

        const res = await get(
          config.PET.PET_INFO(id),
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (res?.isSuccess) {
          const info = res.result;
          setPetInfo(info);
          setName(info.name || '');
          setBirth(info.birth || '');
          setDeath(info.death || '');

          setSelectedType(info.petCase === 'DOG' ? '강아지' : '고양이');

          const colorMap = {
            BLACK: colors.black,
            BROWN: colors.lightBrown,
            YELLOWDARK: colors.ocher,
            GRAY: colors.gray400,
            WHITE: colors.white,
            HALFGRAY: 'halfGray',
          };

          setSelectedColor(colorMap[info.color]);
        } else {
          Alert.alert(
            '불러오기 실패',
            res?.message || '반려동물 정보를 불러올 수 없습니다.',
          );
        }
      } catch (error) {
        console.error('반려동물 조회 에러:', error);
        Alert.alert('에러', '토큰 만료 또는 서버 오류입니다.');
      }
    };

    fetchPetInfo();
  }, [id]);

  const handleModify = async () => {
    try {
      const tokenData = await Keychain.getGenericPassword();
      const token = tokenData?.password;

      const colorMap = {
        '#000000': 'BLACK',
        '#614337': 'BROWN',
        '#DCB072': 'YELLOWDARK',
        '#898989': 'GRAY',
        '#ffffff': 'WHITE',
        halfGray: 'HALFGRAY',
      };
      const colorValue = colorMap[selectedColor] || 'UNKNOWN';

      const payload = {
        name,
        petCase: selectedType === '강아지' ? 'DOG' : 'CAT',
        birth,
        death: death || null,
        color: colorValue,
      };

      const res = await put(config.PET.UPDATE(id), payload, {
        headers: {Authorization: `Bearer ${token}`},
      });

      if (res?.isSuccess) {
        Alert.alert('성공', '수정이 완료되었습니다.');
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'TabNavigator',
                state: {
                  routes: [{name: 'Mypage'}],
                },
              },
            ],
          }),
        );
      } else {
        Alert.alert(
          '수정 실패',
          res?.message || '수정 중 문제가 발생했습니다.',
        );
      }
    } catch (e) {
      console.error('수정 에러:', e);
      Alert.alert('에러', '수정 요청 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async () => {
    try {
      const tokenData = await Keychain.getGenericPassword();
      const token = tokenData?.password;

      const res = await del(config.PET.DELETE(id), {
        headers: {Authorization: `Bearer ${token}`},
      });

      if (res?.isSuccess) {
        Alert.alert('삭제 완료', '반려동물 정보가 삭제되었습니다.');
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'TabNavigator',
                state: {
                  routes: [{name: 'Mypage'}],
                },
              },
            ],
          }),
        );
      } else {
        Alert.alert('삭제 실패', res?.message || '삭제에 실패했습니다.');
      }
    } catch (e) {
      console.error('삭제 에러:', e);
      Alert.alert('에러', '삭제 요청 중 오류가 발생했습니다.');
    }
  };

  return (
    <Container>
      <Label>이름</Label>
      <Input
        value={name}
        onChangeText={setName}
        placeholder="반려동물 이름을 입력하세요"
        placeholderTextColor={colors.gray300}
      />

      <Label>동물 종류</Label>
      <ButtonRow>
        <TypeButton
          selected={selectedType === '강아지'}
          onPress={() => setSelectedType('강아지')}>
          <ButtonText selected={selectedType === '강아지'}>강아지</ButtonText>
        </TypeButton>
        <TypeButton
          selected={selectedType === '고양이'}
          onPress={() => setSelectedType('고양이')}>
          <ButtonText selected={selectedType === '고양이'}>고양이</ButtonText>
        </TypeButton>
      </ButtonRow>

      <Label>생일</Label>
      <Input
        value={birth}
        onChangeText={setBirth}
        placeholder="YYYY-MM-DD 형식으로 작성해주세요"
        placeholderTextColor={colors.gray300}
      />

      <LabelRow>
        <Label>기일</Label>
        <Explain>*작성 시 REBORN 작별하기 콘텐츠를 이용할 수 있습니다.</Explain>
      </LabelRow>
      <Input
        value={death}
        onChangeText={setDeath}
        placeholder="(선택사항) YYYY-MM-DD 형식으로 작성해주세요"
        placeholderTextColor={colors.gray300}
      />

      <Label>색상</Label>
      <ColorRow>
        {colorsToShow.map((color, index) => (
          <TouchableOpacity
            key={`${color}_${index}`}
            onPress={() => setSelectedColor(color)}>
            {color === 'halfGray' ? (
              <HalfColorCircle selected={selectedColor === color}>
                <HalfColorLeft />
                <HalfColorRight />
                {selectedColor === color && getCheckIcon(selectedColor)}
              </HalfColorCircle>
            ) : (
              <ColorOption color={color} selected={selectedColor === color}>
                {selectedColor === color && getCheckIcon(selectedColor)}
              </ColorOption>
            )}
          </TouchableOpacity>
        ))}
      </ColorRow>

      <ButtonRow>
        <ModifyButton onPress={handleModify}>
          <ModifyText>수정</ModifyText>
        </ModifyButton>
        <DeleteButton onPress={handleDelete}>
          <DeleteText>삭제</DeleteText>
        </DeleteButton>
      </ButtonRow>
    </Container>
  );
};

export default PetProfileManage;

const Container = styled.View`
  flex: 1;
  background-color: ${colors.white};
  padding: 0 ${height * 0.02}px ${width * 0.08}px;
`;

const LabelRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 5px;
`;

const Label = styled(NpsText)`
  padding: ${height * 0.025}px 0;
  font-size: ${width * 0.038}px;
  color: ${colors.brown};
`;

const Explain = styled(NpsText)`
  font-size: ${width * 0.03}px;
  color: ${colors.brown};
`;

const Input = styled.TextInput`
  width: 100%;
  height: ${height * 0.07}px;
  border: 1px solid ${colors.gray200};
  border-radius: 5px;
  padding: ${height * 0.02}px;
  color: ${colors.brown};
  font-family: 'NPSfont_regular';
  font-size: ${width * 0.034}px;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  gap: ${width * 0.038}px;
  justify-content: space-between;
`;

const TypeButton = styled.TouchableOpacity`
  flex: 1;
  background-color: ${({selected}) =>
    selected ? colors.yellow : colors.gray200};
  padding: ${height * 0.024}px;
  align-items: center;
  border-radius: 5px;
`;

const ButtonText = styled(NpsText)`
  color: ${({selected}) => (selected ? colors.brown : colors.white)};
  font-size: ${width * 0.034}px;
`;

const ColorRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const ColorOption = styled.View`
  width: 40px;
  height: 40px;
  background-color: ${({color}) => color};
  border-radius: 20px;
  border: 1.5px solid ${colors.brown};
`;

const HalfColorCircle = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  overflow: hidden;
  border: 1.5px solid ${colors.brown};
  flex-direction: row;
`;

const HalfColorLeft = styled.View`
  flex: 1;
  background-color: ${colors.gray400};
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
`;

const HalfColorRight = styled.View`
  flex: 1;
  background-color: ${colors.white};
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
`;

const ModifyButton = styled.TouchableOpacity`
  background-color: ${colors.brown};
  padding: ${height * 0.022}px;
  align-items: center;
  border-radius: 5px;
  margin-top: ${height * 0.06}px;
  width: ${width * 0.44}px;
`;

const ModifyText = styled(NpsText)`
  color: ${colors.white};
  font-size: ${width * 0.038}px;
`;

const DeleteButton = styled.TouchableOpacity`
  background-color: ${colors.red};
  padding: ${height * 0.022}px;
  align-items: center;
  border-radius: 5px;
  margin-top: ${height * 0.06}px;
  width: ${width * 0.44}px;
`;

const DeleteText = styled(NpsText)`
  color: ${colors.white};
  font-size: ${width * 0.038}px;
`;
