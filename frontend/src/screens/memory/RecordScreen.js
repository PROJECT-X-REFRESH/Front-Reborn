import React, {useState, useEffect} from 'react';
import {Dimensions, Modal, Alert} from 'react-native';
import styled from 'styled-components/native';
import colors from './../../constants/colors';
import {NpsText} from '../../components/CustomText';
import EmotionDiary from '../../components/EmotionDiary';
import {get, post, put, del} from '../../services/api';
import config from '../../constants/config';

const {width, height} = Dimensions.get('window');

const RecordScreen = ({navigation, route}) => {
  const {petId, recordId} = route.params;
  const isEditMode = recordId !== null;

  const [contents, setContents] = useState('');
  const [emotion, setEmotion] = useState('default');
  const [loading, setLoading] = useState(isEditMode);

  const [isInfoVisible, setIsInfoVisible] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const fetchRecord = async () => {
        try {
          const res = await get(config.RECORD.DETAIL(recordId));
          setContents(res.result.content);
          setEmotion(res.result.emotion.state);
        } catch (e) {
          console.error('기존 감정일기 불러오기 실패:', e);
          Alert.alert('불러오기 실패', '기존 데이터를 불러오지 못했습니다.');
        } finally {
          setLoading(false);
        }
      };
      fetchRecord();
    }
  }, [isEditMode, recordId]);

  const handleSaveRecord = async ({content, emotion}) => {
    if (!petId) {
      Alert.alert('오류', '반려동물 ID가 없습니다.');
      return;
    }

    try {
      if (isEditMode) {
        await put(config.RECORD.UPDATE(recordId), {
          content,
          emotion,
        });
        Alert.alert('수정 완료', '감정일기가 성공적으로 수정되었습니다.');
      } else {
        await post(config.RECORD.CREATE(petId), {
          content,
          emotion,
        });
        Alert.alert('저장 완료', '감정일기가 성공적으로 저장되었습니다.');
      }
      navigation.goBack();
    } catch (e) {
      console.error('감정일기 저장/수정 실패:', e);
      Alert.alert('실패', '다시 시도해주세요.');
    }
  };

  const handleDeleteRecord = async () => {
    try {
      await del(config.RECORD.DELETE(petId, recordId));
      Alert.alert('삭제 완료', '감정일기가 삭제되었습니다.');
      navigation.goBack();
    } catch (e) {
      console.error('삭제 실패:', e);
      Alert.alert('삭제 실패', '다시 시도해주세요.');
    }
  };

  useEffect(() => {
    navigation.setParams({
      openInfoModal: () => setIsInfoVisible(true),
    });
  }, [navigation]);

  return (
    <Container>
      <EmotionDiaryWrapper>
        {!loading && (
          <EmotionDiary
            onPress={handleSaveRecord}
            setIconName={setEmotion}
            editable={true}
            defaultContents={contents}
            defaultEmotion={emotion}
            isEditMode={isEditMode}
            onDelete={handleDeleteRecord}
          />
        )}
      </EmotionDiaryWrapper>
      <Modal
        statusBarTranslucent
        animationType="slide"
        visible={isInfoVisible}
        transparent>
        <BlackContainer onPress={() => setIsInfoVisible(false)}>
          <InfoContainer>
            <InfoTitleText>
              <YellowTitleText>RE</YellowTitleText>CORD 반려일기 작성 가이드
            </InfoTitleText>
            <InfoText>
              1. 하루에 한 번만 작성할 수 있습니다.{'\n'}
              2. 오늘 동안은 수정 및 삭제가 가능합니다.{'\n'}
              3. 일기를 모두 작성한 후 감정 날씨 버튼을 눌러 오늘의 감정 날씨를
              확인하세요.
            </InfoText>
          </InfoContainer>
        </BlackContainer>
      </Modal>
    </Container>
  );
};

export default RecordScreen;

const Container = styled.View`
  flex: 1;
  padding: ${height * 0.03}px ${width * 0.06}px;
  background-color: ${colors.white};
`;

const EmotionDiaryWrapper = styled.View`
  width: 100%;
  height: 90%;
`;

const BlackContainer = styled.Pressable`
  background-color: rgba(0, 0, 0, 0.25);
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const InfoContainer = styled.View`
  width: ${width * 0.8}px;
  background-color: ${colors.white};
  padding: ${width * 0.1}px ${width * 0.074}px;
  border-radius: 20px;
  gap: 20px;
`;

const InfoTitleText = styled.Text`
  font-family: 'NPSfont_extrabold';
  color: ${colors.brown};
  font-size: ${width * 0.04}px;
  text-align: center;
`;

const YellowTitleText = styled.Text`
  color: ${colors.yellow};
`;

const InfoText = styled(NpsText)`
  font-size: ${width * 0.035}px;
  line-height: ${width * 0.074}px;
  color: ${colors.brown};
  text-align: left;
`;
