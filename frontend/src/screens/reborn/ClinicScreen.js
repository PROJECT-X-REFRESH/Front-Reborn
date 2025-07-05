import React, { useEffect, useState } from 'react';
import { ScrollView, Dimensions, ActivityIndicator, Alert, PermissionsAndroid, Platform } from 'react-native';
import { NpsText, NpsBText } from '../../components/CustomText';
import styled from 'styled-components/native';
import colors from '../../constants/colors';
import Geolocation from '@react-native-community/geolocation';
import { get } from '../../services/api';
import config from '../../constants/config';

import BuildingIcon from '../../assets/images/others/building.svg';
import StarIcon from '../../assets/images/others/star.svg';
import PhoneIcon from '../../assets/images/others/phone.svg';
import PingIcon from '../../assets/images/others/ping.svg';

const { width, height } = Dimensions.get('window');

const ClinicScreen = ({ route }) => {
  const { farewellId } = route.params;
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  async function requestLocationPermission() {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: '위치 권한 요청',
            message: '근처 상담소 확인을 위해 위치 접근 권한이 필요합니다.',
            buttonNeutral: '나중에',
            buttonNegative: '취소',
            buttonPositive: '허용',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      return true; // iOS는 plist 설정으로 충분
    }
  }
  useEffect(() => {
    requestLocationPermission().then(granted => {
      if (!granted) {
        Alert.alert('위치 권한 거부됨', '설정에서 위치 권한을 허용해주세요.');
        setLoading(false);
        return;
      }

      Geolocation.getCurrentPosition(
        async position => {
          const { latitude, longitude } = position.coords;
          console.log('현재 위치:', latitude, longitude);
          try {
            const res = await get(config.RECOGNIZE.NEARBY(farewellId), {
              lat: latitude,
              lng: longitude,
            });
            setClinics(res.result);
          } catch (err) {
            Alert.alert('알림', '근처 상담소를 조회할 수 없습니다.');
          } finally {
            setLoading(false);
          }
        },
        error => {
          console.warn('위치 조회 실패:', error.message);
          Alert.alert('위치 권한 오류', '위치 정보를 가져올 수 없습니다.');
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    });
  }, []);


  if (loading) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color={colors.brown} />
        <NpsText>상담소 정보를 불러오는 중입니다...</NpsText>
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <ScrollView
        contentContainerStyle={{ gap: 20 }}
        showsVerticalScrollIndicator={false}>
        {clinics.map((clinic, index) => (
          <ClinicCard key={index}>
            <ClinicTitle>{clinic.displayName}</ClinicTitle>
            <InfoRow>
              <BuildingIcon width={16} height={16} />
              <ClinicInfo>{clinic.formattedAddress}</ClinicInfo>
            </InfoRow>
            <InfoRow>
              <PhoneIcon width={16} height={16} />
              <ClinicInfo>{clinic.nationalPhoneNumber ? (<ClinicInfo>{clinic.nationalPhoneNumber}</ClinicInfo>) : (<ClinicInfo>전화 번호 정보 없음</ClinicInfo>)}</ClinicInfo>
            </InfoRow>

            <ClinicRow>
              <InfoRow>
                {clinic.openNow === null || clinic.openNow === undefined ? (
                  <ClinicInfo>오픈 정보 없음</ClinicInfo>
                ) : (
                  <Badge style={{ backgroundColor: clinic.openNow ? colors.yellow : colors.gray300 }}>
                    {clinic.openNow ? '영업 중' : '영업 종료'}
                  </Badge>
                )}
              </InfoRow>

              <RowRight>
                <DistanceRow>
                  <PingIcon width={14} height={14} />
                  <DistanceText>
                    {clinic.distanceInMeters
                      ? `${(Number(clinic.distanceInMeters) / 1000).toFixed(1)} km`
                      : '거리 정보 없음'}
                  </DistanceText>
                </DistanceRow>
              </RowRight>
            </ClinicRow>


          </ClinicCard>
        ))}
      </ScrollView>
    </Container>
  );
};

export default ClinicScreen;

const LoadingContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${colors.white};
`;

const Container = styled.View`
  flex: 1;
  background-color: ${colors.white};
  padding: ${height * 0.03}px ${width * 0.06}px;
`;

const ClinicCard = styled.View`
  width: 100%;
  background-color: ${colors.white};
  border-radius: 10px;
  padding: 20px;
  gap: 8px;
  border-width: 1px;
  border-color: ${colors.gray300};
`;

const ClinicTitle = styled(NpsBText)`
  font-size: ${width * 0.038};
  color: ${colors.brown};
`;

const InfoRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

const ClinicInfo = styled(NpsText)`
  font-size: ${width * 0.034};
  color: ${colors.brown};
  margin-right: 10px;
`;

const ClinicRow = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const RowRight = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const Badge = styled(NpsBText)`
  background-color: ${colors.yellow};
  color: ${colors.white};
  padding: 4px 10px;
  border-radius: 18px;
  font-size: ${width * 0.03};
`;

const DistanceText = styled.Text`
  font-size: ${width * 0.034};
  color: ${colors.gray300};
`;

const DistanceRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 2px;
`;
