import React, {useState, useRef} from 'react';
import {Dimensions, KeyboardAvoidingView, ScrollView} from 'react-native';
import styled from 'styled-components/native';
import colors from '../../constants/colors';
import {NpsText, NpsBText} from '../../components/CustomText';

import SendButton from '../../assets/images/others/send.svg';
import BotIcon from '../../assets/images/others/chatbot.svg';

import {post} from '../../services/api';
import config from '../../constants/config';

const {width, height} = Dimensions.get('window');

const ReturnChatScreen = ({route}) => {
  const {userName} = route.params;

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const scrollViewRef = useRef(null);

  const handleSend = async () => {
    const trimmed = message.trim();
    if (!trimmed) return;

    // 사용자 메시지 표시
    setMessages(prev => [...prev, {role: 'user', content: trimmed}]);
    setMessage('');

    try {
      const payload = {
        userId: userName,
        text: trimmed,
      };

      const response = await post(config.AI.CHAT, payload);

      const isSuccess = response?.is_Sucess === true;
      const botReply = isSuccess
        ? response?.result || '응답이 비어 있습니다.'
        : 'AI 응답에 실패했습니다.';

      setMessages(prev => [...prev, {role: 'bot', content: botReply}]);
    } catch (error) {
      console.error('챗봇 오류:', error);
      setMessages(prev => [
        ...prev,
        {role: 'bot', content: '서버 오류가 발생했습니다. 다시 시도해주세요.'},
      ]);
    }

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({animated: true});
    }, 100);
  };

  return (
    <Container>
      <Divider style={{marginTop: height * 0.03}} />

      <ScrollView
        ref={scrollViewRef}
        style={{flex: 1, backgroundColor: colors.gray100}}
        contentContainerStyle={{flexGrow: 1, padding: width * 0.06}}
        keyboardShouldPersistTaps="handled">
        <BotRow>
          <ProfileCircle>
            <BotIcon width={24} height={24} />
          </ProfileCircle>

          <BotTextGroup>
            <ReturnLabel>
              <NpsBText style={{color: colors.yellow, fontSize: width * 0.038}}>
                RE
              </NpsBText>
              <NpsBText style={{color: colors.brown, fontSize: width * 0.038}}>
                TURN
              </NpsBText>
            </ReturnLabel>

            <BotMessageBox>
              <BotMessage>
                안녕하세요, 챗봇 RETURN입니다. 무엇을 도와드릴까요?
              </BotMessage>
            </BotMessageBox>
          </BotTextGroup>
        </BotRow>

        {messages.map((msg, idx) => {
          if (msg.role === 'user') {
            return (
              <UserMessageBox key={idx}>
                <UserMessage>{msg.content}</UserMessage>
              </UserMessageBox>
            );
          } else if (msg.role === 'bot') {
            return (
              <BotRow key={idx}>
                <ProfileCircle>
                  <BotIcon width={24} height={24} />
                </ProfileCircle>
                <BotTextGroup>
                  <BotMessageBox>
                    <BotMessage>{msg.content}</BotMessage>
                  </BotMessageBox>
                </BotTextGroup>
              </BotRow>
            );
          } else {
            return null;
          }
        })}
      </ScrollView>

      <KeyboardAvoidingView>
        <InputRow>
          <MessageInput
            placeholder="메시지를 입력하세요."
            placeholderTextColor={colors.gray300}
            value={message}
            onChangeText={setMessage}
            onSubmitEditing={handleSend}
          />
          <SendButtonWrapper onPress={handleSend}>
            <SendButton width={24} height={24} />
          </SendButtonWrapper>
        </InputRow>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default ReturnChatScreen;

const Container = styled.View`
  flex: 1;
  background-color: ${colors.white};
`;

const Divider = styled.View`
  width: 100%;
  height: 1px;
  background-color: ${colors.gray200};
`;

const BotRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: ${width * 0.04}px;
`;

const ProfileCircle = styled.View`
  width: ${width * 0.12}px;
  height: ${width * 0.12}px;
  border-radius: 50px;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  background-color: ${colors.brown};
`;

const BotTextGroup = styled.View`
  flex-direction: column;
  margin-left: ${width * 0.02}px;
  flex-shrink: 1;
`;

const ReturnLabel = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${width * 0.015}px;
`;

const BotMessageBox = styled.View`
  background-color: ${colors.white};
  border: 1px solid ${colors.brown};
  border-radius: 5px;
  padding: ${width * 0.035}px ${width * 0.04}px;
  max-width: ${width * 0.6}px;
  align-self: flex-start;
`;

const BotMessage = styled(NpsText)`
  color: ${colors.brown};
  font-size: ${width * 0.034}px;
  line-height: ${width * 0.055}px;
`;

const UserMessageBox = styled.View`
  align-self: flex-end;
  background-color: ${colors.brown};
  border-radius: 5px;
  padding: ${width * 0.035}px ${width * 0.04}px;
  max-width: ${width * 0.6}px;
  margin-bottom: ${width * 0.03}px;
`;

const UserMessage = styled(NpsText)`
  color: ${colors.white};
  font-size: ${width * 0.034}px;
  line-height: ${width * 0.055}px;
`;

const InputRow = styled.View`
  flex-direction: row;
  align-items: center;
  border-top-width: 1px;
  border-color: ${colors.gray200};
  padding: ${width * 0.05}px;
  background-color: ${colors.white};
`;

const MessageInput = styled.TextInput`
  flex: 1;
  padding: ${width * 0.04}px;
  font-size: ${width * 0.034}px;
  font-family: 'NPSfont_regular';
  color: ${colors.brown};
`;

const SendButtonWrapper = styled.TouchableOpacity`
  margin-left: ${width * 0.02}px;
`;
