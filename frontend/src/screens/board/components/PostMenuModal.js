import React from 'react';
import { Modal, Alert, TouchableWithoutFeedback } from 'react-native';
import styled from 'styled-components/native';
import colors from '../../../constants/colors';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const PostMenuModal = ({ visible, onClose, onEdit, onDelete }) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <MenuOverlay>
          <TouchableWithoutFeedback>
            <MenuPopup>
              <MenuItemDelete onPress={onDelete}>
                <MenuItemDeleteText>삭제</MenuItemDeleteText>
              </MenuItemDelete>
              <Line />
              <MenuItem onPress={onEdit}>
                <MenuItemText>수정</MenuItemText>
              </MenuItem>
            </MenuPopup>
          </TouchableWithoutFeedback>
        </MenuOverlay>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default PostMenuModal;

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
  shadow-color: ${colors.black};
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

const Line = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: ${colors.gray200};
  margin-vertical: 5%;
`;