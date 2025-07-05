import React, {useState} from 'react';
import {Dimensions, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NpsText} from '../../components/CustomText';
import * as Keychain from 'react-native-keychain';
import styled from 'styled-components/native';
import config from '../../constants/config';
import {post} from '../../services/api';
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

const PetProfileAdd = ({navigation: {navigate}}) => {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [birth, setBirth] = useState('');
  const [death, setDeath] = useState('');
  const [selectedType, setSelectedType] = useState('강아지');
  const [selectedColor, setSelectedColor] = useState(null);

  const colorsToShow = selectedType === '강아지' ? dogColors : catColors;

  const saveProfile = async () => {
    if (!name || !birth || !selectedColor || !selectedType) {
      Alert.alert('입력 오류', '이름, 생일, 색상, 종류를 모두 입력해주세요.');
      return;
    }
    console.log('선택된 색상:', selectedColor);

    const petCase = selectedType === '강아지' ? 'DOG' : 'CAT';
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
      petCase,
      birth,
      death: death || null,
      color: colorValue,
    };

    console.log('서버로 전송할 프로필 데이터:', payload);

    try {
      const accessData = await Keychain.getGenericPassword();
      const token = accessData?.password;

      const response = await post(config.PET.CREATE_PROFILE, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.isSuccess) {
        navigation.reset({
          index: 0,
          routes: [{name: 'TabNavigator'}],
        });
      } else {
        Alert.alert('실패', response.message || '프로필 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('프로필 저장 실패:', error);
      Alert.alert('에러', '네트워크 오류 또는 서버 문제입니다.');
    }
  };

  return (
    <Container>
      <TitleContainer>
        <TitleText>
          <HBHighlightText>RE</HBHighlightText>BORN
        </TitleText>
        <SubTitleText>반려동물 프로필을 작성해주세요!</SubTitleText>
      </TitleContainer>
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
        <Explain>
          {' '}
          *작성 시 REBORN 작별하기 콘텐츠를 이용할 수 있습니다.
        </Explain>
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
          <TouchableOpacity key={index} onPress={() => setSelectedColor(color)}>
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
      <SaveButtonContainer>
        <SaveButton onPress={saveProfile}>
          <SaveText>저장</SaveText>
        </SaveButton>
      </SaveButtonContainer>
    </Container>
  );
};

export default PetProfileAdd;

const Container = styled.View`
  flex: 1;
  background-color: ${colors.white};
  padding: ${height * 0.08}px ${width * 0.06}px;
`;

const TitleContainer = styled.View`
  align-items: center;
`;

const TitleText = styled.Text`
  font-size: ${width * 0.12}px;
  font-family: 'Hakgyoansim Dunggeunmiso TTF B';
  color: ${colors.brown};
  margin: 10px;
`;

const SubTitleText = styled(NpsText)`
  font-size: ${width * 0.04}px;
  color: ${colors.brown};
`;

const HBHighlightText = styled.Text`
  font-size: ${width * 0.12}px;
  color: ${colors.yellow};
  font-family: 'Hakgyoansim Dunggeunmiso TTF B';
`;

const LabelRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 5px;
`;

const Label = styled(NpsText)`
  padding: ${height * 0.02}px 0;
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
  text-align: left;
  vertical-align: center;
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

const SaveButtonContainer = styled.View`
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const SaveButton = styled.TouchableOpacity`
  background-color: ${colors.brown};
  padding: ${height * 0.022}px;
  align-items: center;
  border-radius: 5px;
  margin-top: ${height * 0.05}px;
  width: ${width * 0.42}px;
`;

const SaveText = styled(NpsText)`
  color: ${colors.white};
  font-size: ${width * 0.038}px;
`;
