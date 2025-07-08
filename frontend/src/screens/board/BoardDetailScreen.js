import React, { useEffect, useState } from 'react';
import {
  View,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Alert,
  SafeAreaView,
} from 'react-native';
import { put, del } from '../../services/api';
import config from '../../constants/config';
import styled from 'styled-components/native';
import colors from '../../constants/colors';

import ProfileIcon from '../../assets/images/others/profile.svg';
import ThreeDotIcon from '../../assets/images/others/three_dots.svg';
import HeartEmptyIcon from '../../assets/images/others/heart_empty.svg';
import HeartFillIcon from '../../assets/images/others/heart_fill.svg';
import SendIcon from '../../assets/images/others/send.svg';
import CommentItem from './item/CommentItem';

import {
  fetchBoardDetail,
  fetchComments,
  createComment,
  deleteComment,
  toggleBoardLike,
} from '../../services/boardapi';

const { width, height } = Dimensions.get('window');

const BoardDetailScreen = ({ route, navigation }) => {
  const { boardId, category = 'POST' } = route.params || {};

  const [boardWriter, setBoardWriter] = useState('');
  const [boardCreatedAt, setBoardCreatedAt] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [boardImage, setBoardImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [liked, setLiked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [imageHeight, setImageHeight] = useState(width * 0.88);

  useEffect(() => {
    const loadBoardDetail = async () => {
      try {
        const detail = await fetchBoardDetail(boardId);
        const formattedTime = detail.createdAt?.substring(0, 16).replace('T', ' ') || '';
        setBoardWriter(detail.writerName);
        setBoardCreatedAt(formattedTime);
        setOriginalContent(detail.content);
        setEditedContent(detail.content);
        setLiked(detail.like);
        setBoardImage(detail.attachImg || null);
        setProfileImage(detail.writerProfileImage || null);

        // 이미지가 있으면 크기 미리 계산
        if (detail.attachImg) {
          const { Image } = require('react-native');
          Image.getSize(
            detail.attachImg,
            (imgWidth, imgHeight) => {
              const aspectRatio = imgHeight / imgWidth;
              const calculatedHeight = (width * 0.88) * aspectRatio;
              setImageHeight(Math.min(calculatedHeight, width * 0.88));
            },
            () => {
              setImageHeight(width * 0.88);
            }
          );
        }
      } catch {
        Alert.alert('오류', '게시글을 불러오는 중 문제가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    const loadComments = async () => {
      try {
        const commentData = await fetchComments(boardId);
        setComments(commentData.map(c => ({
          id: String(c.id),
          user: c.commentWriter,
          time: c.createdAt.substring(0, 16).replace('T', ' '),
          text: c.contents,
          profileImage: c.writerProfileImage,
        })));
      } catch {
        Alert.alert('오류', '댓글을 불러오는 중 문제가 발생했습니다.');
      }
    };

    loadBoardDetail();
    loadComments();
  }, [boardId]);

  const handleEdit = async () => {
    try {
      await put(config.BOARD.UPDATE(boardId), { category, content: editedContent });
      setOriginalContent(editedContent);
      setIsEditing(false);
    } catch {
      Alert.alert('권한 없음', '게시글 수정은 작성자만 가능합니다.');
    }
  };

  const handleCreateComment = async () => {
    if (!newComment.trim()) return;
    try {
      await createComment(boardId, newComment.trim());
      setNewComment('');
      Keyboard.dismiss();
      const updated = await fetchComments(boardId);
      setComments(updated.map(c => ({
        id: String(c.id),
        user: c.commentWriter,
        time: c.createdAt.substring(0, 16).replace('T', ' '),
        text: c.contents,
        profileImage: c.writerProfileImage,
      })));
    } catch {
      Alert.alert('오류', '댓글 작성에 실패했습니다.');
    }
  };

  const handleToggleLike = async () => {
    try {
      await toggleBoardLike(boardId);
      setLiked(prev => !prev);
    } catch {
      Alert.alert('오류', '좋아요 처리에 실패했습니다.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch {
      Alert.alert('권한 없음', '댓글 삭제는 작성자만 가능합니다.');
    }
  };

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
            nestedScrollEnabled={false}
            scrollEnabled={true}
            bounces={true}
          >
            <Header>
              <ProfileImageContainer>
                {profileImage ? (
                  <ProfilePhoto source={{ uri: profileImage }} />
                ) : (
                  <ProfileIcon width={width * 0.05} />
                )}
              </ProfileImageContainer>
              <UserInfo>
                <UserName>{boardWriter}</UserName>
                <PostMeta>{boardCreatedAt}</PostMeta>
              </UserInfo>
              <TouchableOpacity onPress={() => setMenuVisible(true)}>
                <ThreeDotIcon />
              </TouchableOpacity>
            </Header>

            {isEditing ? (
              <>
                <PostInput
                  value={editedContent}
                  onChangeText={setEditedContent}
                  multiline
                  blurOnSubmit={false}
                  textAlignVertical="top"
                  placeholder="내용을 입력하세요"
                  scrollEnabled={false}
                />
                <EditButtonRow>
                  <EditConfirmButton onPress={handleEdit}>
                    <EditConfirmText>완료</EditConfirmText>
                  </EditConfirmButton>
                  <EditCancelButton onPress={() => {
                    setEditedContent(originalContent);
                    setIsEditing(false);
                  }}>
                    <EditCancelText>취소</EditCancelText>
                  </EditCancelButton>
                </EditButtonRow>
              </>
            ) : (
              <PostText>{originalContent}</PostText>
            )}

            {boardImage && (
              <PostImageContainer>
                <PostImage
                  source={{ uri: boardImage }}
                  style={{
                    width: width * 0.88,
                    height: imageHeight,
                  }}
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

      <Modal
        transparent
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <MenuOverlay>
            <TouchableWithoutFeedback>
              <MenuPopup>
                <MenuItemDelete
                  onPress={() => {
                    Alert.alert(
                      '삭제 확인',
                      '정말 이 게시글을 삭제하시겠습니까?',
                      [
                        { text: '취소', style: 'cancel' },
                        {
                          text: '삭제',
                          style: 'destructive',
                          onPress: async () => {
                            try {
                              await del(config.BOARD.DELETE(boardId));
                              setMenuVisible(false);
                              navigation.goBack();
                            } catch {
                              Alert.alert(
                                '권한 없음',
                                '게시글 삭제는 작성자만 가능합니다.',
                              );
                            }
                          },
                        },
                      ],
                    );
                  }}>
                  <MenuItemDeleteText>삭제</MenuItemDeleteText>
                </MenuItemDelete>
                <Line />
                <MenuItem
                  onPress={() => {
                    setMenuVisible(false);
                    setIsEditing(true);
                  }}>
                  <MenuItemText>수정</MenuItemText>
                </MenuItem>
              </MenuPopup>
            </TouchableWithoutFeedback>
          </MenuOverlay>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

export default BoardDetailScreen;

const Container = styled.View`
  flex: 1;
  background-color: ${colors.white};
  padding: ${width * 0.06}px;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

const ProfileImageContainer = styled.View`
  width: ${width * 0.15}px;
  height: ${width * 0.15}px;
  align-items: center;
  justify-content: center;
  border-radius: 50px;
  background-color: ${colors.gray200};
`;

const UserInfo = styled.View`
  flex: 1;
  flex-direction: column;
  margin-left: 5%;
`;

const UserName = styled.Text`
  font-size: ${width * 0.04}px;
  font-family: 'NPSfont_bold';
  color: ${colors.brown};
`;

const PostMeta = styled.Text`
  font-size: ${width * 0.03}px;
  font-family: 'NPSfont_regular';
  color: ${colors.gray300};
  margin-top: 2px;
`;

const PostText = styled.Text`
  font-size: ${width * 0.038}px;
  font-family: 'NPSfont_regular';
  color: ${colors.brown};
  margin: ${width * 0.03}px 0;
  line-height: 20px;
`;

const PostInput = styled.TextInput`
  font-size: ${width * 0.038}px;
  font-family: 'NPSfont_regular';
  color: ${colors.brown};
  margin: ${width * 0.03}px 0;
  border: 1px solid ${colors.gray200};
  border-radius: 8px;
  padding: 10px;
  min-height: 100px;
  max-height: 200px;
`;

const EditButtonRow = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  gap: ${width * 0.04}px;
  margin-bottom: ${width * 0.02}px;
`;

const EditConfirmButton = styled.TouchableOpacity`
  background-color: ${colors.brown};
  padding: ${width * 0.02}px ${width * 0.04}px;
  border-radius: 10px;
`;

const EditConfirmText = styled.Text`
  color: ${colors.white};
  font-family: 'NPSfont_bold';
`;

const EditCancelButton = styled.TouchableOpacity`
  background-color: ${colors.gray200};
  padding: ${width * 0.02}px ${width * 0.04}px;
  border-radius: 10px;
`;

const EditCancelText = styled.Text`
  color: ${colors.brown};
  font-family: 'NPSfont_bold';
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
  border: 1px solid #ddd;
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

const MenuOverlay = styled.View`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.2);
  justify-content: flex-start;
  align-items: flex-end;
  padding: ${height * 0.1}px ${width * 0.05}px 0 0;
`;

const MenuPopup = styled.View`
  width: ${width * 0.25}px;
  background-color: ${colors.white};
  border-radius: 10px;
  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
  z-index: 99;
`;

const MenuItem = styled.TouchableOpacity`
  padding: ${width * 0.03}px;
  align-items: center;
`;

const MenuItemDelete = styled(MenuItem)``;

const MenuItemText = styled.Text`
  color: ${colors.brown};
  font-family: 'NPSfont_regular';
`;

const MenuItemDeleteText = styled(MenuItemText)`
  color: red;
  font-family: 'NPSfont_bold';
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