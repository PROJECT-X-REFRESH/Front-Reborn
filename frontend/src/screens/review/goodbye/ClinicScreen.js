import React from 'react';
import {ScrollView, Dimensions} from 'react-native';
import {NpsText, NpsBText} from '../../../components/CustomText';
import styled from 'styled-components/native';
import colors from '../../../constants/colors';

import BuildingIcon from '../../../assets/images/others/building.svg';
import PhoneIcon from '../../../assets/images/others/clock.svg';
import ClockIcon from '../../../assets/images/others/phone.svg';
import PingIcon from '../../../assets/images/others/ping.svg';

const {width, height} = Dimensions.get('window');

const clinics = [
  {
    name: '응애 상담소',
    address: '경기도 고양시 행신동 햇빛마을 1804',
    phone: '02-300-1234',
    time: '09:00 ~ 18:00',
    distance: '123m',
    recommended: true,
  },
  {
    name: '응애 상담소',
    address: '경기도 고양시 행신동 햇빛마을 1804',
    phone: '02-300-1234',
    time: '09:00 ~ 18:00',
    distance: '125m',
    recommended: false,
  },
  {
    name: '응애 상담소',
    address: '경기도 고양시 행신동 햇빛마을 1804',
    phone: '02-300-1234',
    time: '09:00 ~ 18:00',
    distance: '185m',
    recommended: false,
  },
  {
    name: '응애 상담소',
    address: '경기도 고양시 행신동 햇빛마을 1804',
    phone: '02-300-1234',
    time: '09:00 ~ 18:00',
    distance: '185m',
    recommended: false,
  },
];

const ClinicScreen = () => {
  return (
    <Container>
      <ScrollView
        contentContainerStyle={{gap: 20}}
        showsVerticalScrollIndicator={false}>
        {clinics.map((clinic, index) => (
          <ClinicCard key={index}>
            <ClinicTitle>{clinic.name}</ClinicTitle>
            <InfoRow>
              <BuildingIcon width={16} height={16} />
              <ClinicInfo>{clinic.address}</ClinicInfo>
            </InfoRow>
            <InfoRow>
              <PhoneIcon width={16} height={16} />
              <ClinicInfo>{clinic.phone}</ClinicInfo>
            </InfoRow>

            <ClinicRow>
              <InfoRow>
                <ClockIcon width={16} height={16} />
                <ClinicInfo>{clinic.time}</ClinicInfo>
              </InfoRow>
              <RowRight>
                {clinic.recommended && <Badge>추천</Badge>}
                <DistanceRow>
                  <PingIcon></PingIcon>
                  <DistanceText>{clinic.distance}</DistanceText>
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
