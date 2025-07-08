import React from 'react';
import { Dimensions, TouchableOpacity, View, Text } from 'react-native';
import styled from 'styled-components/native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton } from 'react-native-gesture-handler';
import colors from '../../../constants/colors';
import ProfileIcon from '../../../assets/images/others/profile.svg';

const { width, height } = Dimensions.get('window');

const ChatListItem = ({ navigation, roomId, name, message, date, onDelete }) => {
  const renderRightActions = () => (
    <DeleteButton onPress={onDelete}>
      <DeleteText>삭제</DeleteText>
    </DeleteButton>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity onPress={() => navigation.navigate("TalkScreen", {
      roomId, name})}>
        <Container>
          <ProfileCircle>
            <ProfileIcon width={24} height={24} />
          </ProfileCircle>
          <ChatContent>
            <NameText>{name}</NameText>
            <MessageText>
              {message.slice(0, 17)}
              {message.length > 17 ? '..' : ''}
            </MessageText>
          </ChatContent>
          <DateText>{date}</DateText>
        </Container>
      </TouchableOpacity>
    </Swipeable>
  );
};

export default ChatListItem;

// TODO: 반응형으로 수정
const Container = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 15px 20px;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.gray200};
  background-color: ${colors.white};
`;

const ProfileCircle = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${colors.gray200};
  align-items: center;
  justify-content: center;
`;

const ChatContent = styled.View`
  flex: 1;
  margin-left: 15px;
`;

const NameText = styled.Text`
  font-size: 15px;
  font-family: 'NPSfont_bold';
  color: ${colors.black};
`;

const MessageText = styled.Text`
  font-size: 13px;
  color: ${colors.gray400};
  margin-top: 2px;
  font-family: 'NPSfont_regular';
`;

const DateText = styled.Text`
  font-size: 12px;
  color: ${colors.gray400};
  font-family: 'NPSfont_regular';
`;

const DeleteButton = styled(RectButton)`
  background-color: ${colors.brown};
  justify-content: center;
  align-items: center;
  width: 80px;
`;

const DeleteText = styled.Text`
  color: white;
  font-family: 'NPSfont_bold';
  font-size: 14px;
`;
