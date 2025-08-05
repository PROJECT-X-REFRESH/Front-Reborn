import React from 'react';
import styled from 'styled-components/native';
import { Dimensions } from 'react-native';
import colors from '../../../constants/colors';
import BotIcon from '../../../assets/images/others/chatbot.svg';

const { width, height } = Dimensions.get('window');

const ChatbotButton = ({ navigation, userName }) => {
  return (
    <Button
      onPress={() =>
        navigation.navigate('ReturnChatNavigator', {
          screen: 'ReturnChatScreen',
          params: { userName },
        })
      }>
      <BotIcon width={24} height={24} />
    </Button>
  );
};

export default ChatbotButton;

const Button = styled.TouchableOpacity`
  position: absolute;
  bottom: ${height * 0.03}px;
  right: ${width * 0.06}px;
  background-color: ${colors.brown};
  width: ${width * 0.14}px;
  height: ${width * 0.14}px;
  border-radius: ${width * 0.07}px;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;
