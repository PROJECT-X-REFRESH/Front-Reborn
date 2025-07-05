import React from 'react';
import { Dimensions, TouchableOpacity, Alert } from 'react-native';
import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';
import ProfileIcon from '../../../assets/images/others/profile.svg';
import colors from '../../../constants/colors';

const { width, height } = Dimensions.get('window');

const CommentItem = ({ user, time, text, profileImage, onDelete }) => {
  return (
    <TouchableOpacity
      onLongPress={() => {
        Alert.alert(
          '댓글 삭제',
          '정말로 이 댓글을 삭제하시겠습니까?',
          [
            { text: '취소', style: 'cancel' },
            {
              text: '삭제',
              style: 'destructive',
              onPress: () => onDelete(),
            },
          ],
          { cancelable: true }
        );
      }}
      delayLongPress={500}
      activeOpacity={0.8}
    >
      <CommentHeader>
        <ProfileImageContainer>
          {profileImage ? (
            <ProfilePhoto source={{ uri: profileImage }} />
          ) : (
            <ProfileIcon width={width * 0.05} />
          )}
        </ProfileImageContainer>
        <CommentBubble>
          <CommentUserRow>
            <CommentUser>{user}</CommentUser>
            <CommentTime> · {time}</CommentTime>
          </CommentUserRow>
          <CommentText>{text}</CommentText>
        </CommentBubble>
      </CommentHeader>
    </TouchableOpacity>
  );
};

export default CommentItem;

const CommentHeader = styled.View`
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: ${height * 0.015}px;;
`;

const ProfileImageContainer = styled.View`
  width: ${width * 0.12}px;
  height: ${width * 0.12}px;
  align-items: center;
  justify-content: center;
  border-radius: 50px;
  background-color: ${colors.gray200};
`;

const CommentBubble = styled.View`
  background-color: #f1f1f1;
  padding: 8px 12px;
  border-radius: 10px;
  max-width: ${width * 0.7}px;
  margin-left: 10px;
`;

const CommentUserRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 2px;
`;

const CommentUser = styled.Text`
  font-size: ${width * 0.034}px;
  font-family: 'NPSfont_bold';
  color: ${colors.brown};
`;

const CommentTime = styled.Text`
  font-size: ${width * 0.03}px;
  font-family: 'NPSfont_regular';
  color: ${colors.gray300};
  margin-left: 4px;
`;

const CommentText = styled.Text`
  font-size: ${width * 0.034}px;
  font-family: 'NPSfont_regular';
  color: ${colors.brown};
`;

const ProfilePhoto = styled.Image`
  width: ${width * 0.12}px;
  height: ${width * 0.12}px;
  border-radius: 50px;
`;

const DeleteButton = styled(RectButton)`
  background-color: ${colors.red};
  justify-content: center;
  align-items: center;
  height: ${width * 0.12}px;
  border-radius: 10px;
  width: ${width * 0.12}px;
  margin-left: -20px;
`;

const DeleteText = styled.Text`
  color: white;
  font-family: 'NPSfont_bold';
  font-size: 14px;
`;
