import React from 'react';
import styled from 'styled-components/native';
import colors from '../../../constants/colors';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const PostContentEditor = ({
  isEditing,
  originalContent,
  editedContent,
  setEditedContent,
  onEditConfirm,
  onEditCancel,
}) => {
  if (isEditing) {
    return (
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
          <EditConfirmButton onPress={onEditConfirm}>
            <EditConfirmText>완료</EditConfirmText>
          </EditConfirmButton>
          <EditCancelButton onPress={onEditCancel}>
            <EditCancelText>취소</EditCancelText>
          </EditCancelButton>
        </EditButtonRow>
      </>
    );
  } else {
    return <PostText>{originalContent}</PostText>;
  }
};

export default PostContentEditor;

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

const PostText = styled.Text`
  font-size: ${width * 0.038}px;
  font-family: 'NPSfont_regular';
  color: ${colors.brown};
  margin: ${width * 0.03}px 0;
  line-height: 20px;
`;
