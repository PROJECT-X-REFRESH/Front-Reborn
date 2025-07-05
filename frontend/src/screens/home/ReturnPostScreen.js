import React, { useEffect, useState } from 'react';
import { View, Text, Image, Dimensions, ScrollView, ActivityIndicator, Linking } from 'react-native';
import styled from 'styled-components/native';
import colors from '../../constants/colors';

import { NpsText } from '../../components/CustomText';

import ReturnIcon from '../../assets/images/others/chatbot.svg'
import { fetchReturnPostDetail } from '../../services/boardapi';

const { width, height } = Dimensions.get('window');

const ReturnPostScreen = ({ route }) => {
  const { postId } = route?.params || {};
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;

    const loadDetail = async () => {
      try {
        const data = await fetchReturnPostDetail(postId);
        setPost(data);
        console.log('포스트 상세 로딩 성공:', data);
      } catch (e) {
        console.error('포스트 상세 로딩 실패:', e.message);
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [postId]);

  if (loading) {
    return (
      <Centered>
        <ActivityIndicator size="large" color={colors.brown} />
      </Centered>
    );
  }
  if (!post) {
    return (
      <Container>
        <PostTitle>포스트 데이터를 불러올 수 없습니다.</PostTitle>
      </Container>
    );
  }

  return (
    <Container>
      <PostTitle>{post.title}</PostTitle>
      <ScrollView>
        <LabelContainer>
          <CircleButton><ReturnIcon width='60%' height='60%' /></CircleButton>
          <LabelText><HighlightText>RE</HighlightText>TURN</LabelText>
        </LabelContainer>
        {post.url && (
          <LinkWrapper onPress={() => Linking.openURL(post.url)}>
            <LinkText numberOfLines={1}>상세 기사 링크 {">"} {post.url}</LinkText>
          </LinkWrapper>
        )}
        <Line></Line>
        {post.attachImg && (
          <PostImage source={{ uri: post.attachImg }} />
        )}
        <Content>
          <PostContent>{post.content}</PostContent>
        </Content>
      </ScrollView>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: ${colors.white};
  padding: ${height * 0.05}px ${width * 0.06}px;
`;

const Centered = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const PostTitle = styled.Text`
  font-size: ${width * 0.05}px;
  font-family: 'NPSfont_bold';
  color: ${colors.brown};
  margin-bottom: ${height * 0.02}px;
`;

const CircleButton = styled.View`
  width: ${width * 0.07}px;
  height: ${width * 0.07}px;
  border-radius: 20px;
  background-color: ${colors.brown};
  align-items: center;
  justify-content: center;
`;

const LabelContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${height * 0.015}px;
`;

const LabelText = styled.Text`
  font-size: ${width * 0.038}px;
  font-family: 'NPSfont_bold';
  color: ${colors.brown};
  margin: 0 ${width * 0.02}px;
`;

const HighlightText = styled(NpsText)`
  color: ${colors.yellow};
`;

const PostImage = styled.Image`
  width: 100%;
  height: undefined;
  aspect-ratio: 1;
  border-radius: 10px;
  margin-bottom: ${height * 0.01}px;
  resize-mode: contain;
`;

const Content = styled.View``;

const PostContent = styled.Text`
  font-size: ${width * 0.04}px;
  font-family: 'NPSfont_regular';
  color: ${colors.brown};
  margin-bottom: ${height * 0.015}px;
  line-height: ${width * 0.05}px;
`;

const Line = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: ${colors.gray200};
  margin-bottom: ${height * 0.02}px;
  `;

const LinkWrapper = styled.TouchableOpacity`
  margin-bottom: ${height * 0.02}px;
`;

const LinkText = styled.Text`
  color: ${colors.blue || colors.gray300};
  text-decoration: underline;
  font-size: ${width * 0.032}px;
  font-family: 'NPSfont_regular';
`;

export default ReturnPostScreen;
