import React, {useEffect, useState} from 'react';
import {FlatList, TouchableOpacity, Dimensions, Alert} from 'react-native';
import {NpsText, NpsBText} from '../../components/CustomText';
import * as Keychain from 'react-native-keychain';
import {get} from '../../services/api';
import config from '../../constants/config';
import styled from 'styled-components/native';
import colors from '../../constants/colors';
import PlusIcon from '../../assets/images/others/add.svg';
import RibbonIcon from '../../assets/images/others/ribbon_black.svg';
import AnimalImages from '../../components/AnimalImages';

const {width, height} = Dimensions.get('window');

const PetProfileList = ({navigation: {navigate}}) => {
  const [petProfiles, setPetProfiles] = useState([]);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const tokenData = await Keychain.getGenericPassword();
        const token = tokenData?.password;

        const res = await get(
          config.PET.LIST(0),
          {fetchSize: 10},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (res?.isSuccess) {
          setPetProfiles(res.result);
        } else {
          Alert.alert('에러', res?.message || '목록을 불러올 수 없습니다.');
        }
      } catch (error) {
        console.error('목록 요청 에러:', error);
        Alert.alert(
          '네트워크 오류',
          '토큰이 만료되었거나 서버와 연결할 수 없습니다.',
        );
      }
    };

    fetchPets();
  }, []);

  return (
    <Container>
      <FlatList
        data={petProfiles}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => {
          const imageSrc =
            AnimalImages[item.petCase]?.[item.color]?.profile ??
            require('../../assets/images/pets/dog/white/dog_profile.png');

          return (
            <TouchableOpacity
              onPress={() => navigate('PetProfileManage', {id: item.id})}>
              <ProfileItem>
                <ProfileImage source={imageSrc} />
                <ProfileName>
                  {item.name}{' '}
                  {item.death && (
                    <RibbonIcon width={width * 0.05} height={width * 0.05} />
                  )}
                </ProfileName>
              </ProfileItem>
            </TouchableOpacity>
          );
        }}
      />

      <AddButtonContainer>
        <AddButton
          onPress={() =>
            navigate('MypageStackNavigator', {screen: 'PetProfileAdd'})
          }>
          <AddText>반려동물 프로필 추가하기</AddText>
          <Circle>
            <PlusIcon width={width * 0.06} height={width * 0.06} />
          </Circle>
        </AddButton>
      </AddButtonContainer>
    </Container>
  );
};

export default PetProfileList;

const Container = styled.View`
  flex: 1;
  background-color: ${colors.white};
  padding: 0 ${height * 0.02}px ${width * 0.08}px;
`;

const ProfileItem = styled.View`
  flex-direction: row;
  align-items: center;
  padding: ${height * 0.03}px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.gray200};
`;

const ProfileImage = styled.Image`
  width: ${width * 0.18}px;
  height: ${width * 0.18}px;
  border-radius: 5px;
  margin-right: ${width * 0.05}px;
`;

const ProfileName = styled(NpsBText)`
  font-size: ${width * 0.05}px;
  color: ${colors.brown};
`;

const AddButtonContainer = styled.View`
  align-items: flex-end;
  margin-top: ${height * 0.02}px;
`;

const AddButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: ${height * 0.02}px;
`;

const Circle = styled.View`
  width: ${width * 0.12}px;
  height: ${width * 0.12}px;
  border-radius: 50px;
  background-color: ${colors.brown};
  align-items: center;
  justify-content: center;
`;

const AddText = styled(NpsText)`
  margin-right: ${width * 0.03}px;
  font-size: ${width * 0.04}px;
`;
