import React, { useEffect, useState } from 'react';
import {
  View, Dimensions, ScrollView, KeyboardAvoidingView, Platform, Keyboard,
  TouchableWithoutFeedback, TouchableOpacity, ActivityIndicator, SafeAreaView, Alert,
} from 'react-native';
import { put, del } from '../../services/api';
import config from '../../constants/config';
import styled from 'styled-components/native';
import colors from '../../constants/colors';

import HeartEmptyIcon from '../../assets/images/others/heart_empty.svg';
import HeartFillIcon from '../../assets/images/others/heart_fill.svg';
import SendIcon from '../../assets/images/others/send.svg';

import CommentItem from './items/CommentItem';
import PostContentEditor from './components/PostContentEditor';
import PostMenuModal from './components/PostMenuModal';
import PostHeader from './components/PostHeader';
import { useComments } from './hooks/useComments';
import { useBoardDetail } from './hooks/useBoardDetail';

const { width } = Dimensions.get('window');

const BoardDetailScreen = ({ route, navigation }) => {
  const { boardId, category = 'POST' } = route.params || {};
  const {
    loading, writer, createdAt, content, editedContent, setEditedContent,
    isEditing, setIsEditing, profileImage, boardImage, imageHeight, liked,
    menuVisible, setMenuVisible, handleEdit, handleToggleLike,
  } = useBoardDetail(boardId, category);

  const { comments, newComment, setNewComment,
    handleCreateComment, handleDeleteComment } = useComments(boardId);

  if (loading) {
    return (
      <Centered>
        <ActivityIndicator size="large" color={colors.brown} />
      </Centered>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <Container>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
          >
            <PostHeader
              writer={writer}
              createdAt={createdAt}
              profileImage={profileImage}
              onOpenMenu={() => setMenuVisible(true)}
            />

            <PostContentEditor
              isEditing={isEditing}
              originalContent={content}
              editedContent={editedContent}
              setEditedContent={setEditedContent}
              onEditConfirm={handleEdit}
              onEditCancel={() => {
                setEditedContent(content);
                setIsEditing(false);
              }}
            />

            {boardImage && (
              <PostImageContainer>
                <PostImage
                  source={{ uri: boardImage }}
                  style={{ width: width * 0.88, height: imageHeight }}
                  resizeMode="cover"
                />
              </PostImageContainer>
            )}

            <IconRow>
              <TouchableOpacity onPress={handleToggleLike} style={{ marginRight: 15 }}>
                {liked ? <HeartFillIcon /> : <HeartEmptyIcon />}
              </TouchableOpacity>
            </IconRow>

            <Line />

            <CommentsSection>
              {comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  user={comment.user}
                  time={comment.time}
                  text={comment.text}
                  profileImage={comment.profileImage}
                  onDelete={() => handleDeleteComment(comment.id)}
                />
              ))}
            </CommentsSection>
          </ScrollView>

          <FixedFooter>
            <CommentInputRow>
              <CommentInput
                placeholder="댓글을 입력하세요."
                placeholderTextColor="#aaa"
                blurOnSubmit={false}
                value={newComment}
                onChangeText={setNewComment}
                multiline={false}
                maxLength={200}
              />
              <SendButton onPress={handleCreateComment}>
                <SendIcon width={width * 0.07} />
              </SendButton>
            </CommentInputRow>
          </FixedFooter>
        </Container>
      </KeyboardAvoidingView>

      <PostMenuModal
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onEdit={() => {
          setMenuVisible(false);
          setIsEditing(true);
        }}
        onDelete={() => {
          Alert.alert('삭제 확인', '정말 이 게시글을 삭제하시겠습니까?', [
            { text: '취소', style: 'cancel' },
            {
              text: '삭제',
              style: 'destructive',
              onPress: async () => {
                try {
                  await del(config.BOARD.DELETE(boardId));
                  setMenuVisible(false);
                  navigation.reset({
                    index: 0,
                    routes: [
                      {
                        name: 'BoardListScreen',
                        params: { category },
                        key: `BoardListScreen-${category}`,
                      },
                    ],
                  });
                } catch {
                  Alert.alert('권한 없음', '게시글 삭제는 작성자만 가능합니다.');
                }
              },
            },
          ]);
        }}
      />
    </SafeAreaView>
  );
};

export default BoardDetailScreen;

const Container = styled.View`
  flex: 1;
  background-color: ${colors.white};
  padding: ${width * 0.06}px;
`;

const PostImageContainer = styled.View`
  width: 100%;
  align-items: center;
  margin-bottom: ${width * 0.04}px;
`;

const PostImage = styled.Image`
  border-radius: 12px;
`;

const ProfilePhoto = styled.Image`
  width: ${width * 0.15}px;
  height: ${width * 0.15}px;
  border-radius: 50px;
`;

const IconRow = styled.View`
  flex-direction: row;
`;

const Line = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: ${colors.gray200};
  margin-vertical: 5%;
`;

const CommentsSection = styled.View`
  flex: 1;
`;

const CommentInputRow = styled.View`
  flex-direction: row;
  align-items: center;
  border: 1px solid ${colors.gray200};
  border-radius: 20px;
  padding: ${width * 0.01}px ${width * 0.04}px;
  margin-top: ${width * 0.02}px;
`;

const CommentInput = styled.TextInput`
  flex: 1;
  font-size: ${width * 0.035}px;
  color: ${colors.brown};
  max-height: 80px;
`;

const SendButton = styled.TouchableOpacity`
  padding: 2%;
  border-radius: 20px;
  margin-left: ${width * 0.01}px;
`;

const Centered = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const FixedFooter = styled.View`
  background-color: ${colors.white};
  border-top-width: 1px;
  border-top-color: ${colors.gray100};
`;