import React from 'react';
import styled from 'styled-components/native';
import { Dimensions, TouchableOpacity } from 'react-native';
import colors from '../../../constants/colors';
import ProfileIcon from '../../../assets/images/others/profile.svg';
import ThreeDotIcon from '../../../assets/images/others/three_dots.svg';

const { width } = Dimensions.get('window');

const PostHeader = ({ writer, createdAt, profileImage, onOpenMenu }) => {
  return (
    <Header>
      <ProfileImageContainer>
        {profileImage ? (
          <ProfilePhoto source={{ uri: profileImage }} />
        ) : (
          <ProfileIcon width={width * 0.05} />
        )}
      </ProfileImageContainer>
      <UserInfo>
        <UserName>{writer}</UserName>
        <PostMeta>{createdAt}</PostMeta>
      </UserInfo>
      <TouchableOpacity onPress={onOpenMenu}>
        <ThreeDotIcon />
      </TouchableOpacity>
    </Header>
  );
};

export default PostHeader;

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

const ProfilePhoto = styled.Image`
  width: ${width * 0.15}px;
  height: ${width * 0.15}px;
  border-radius: 50px;
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