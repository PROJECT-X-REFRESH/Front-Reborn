import React, { memo } from "react";
import { Dimensions } from "react-native";
import styled from "styled-components/native";
import colors from "../../../constants/colors";

import ProfileIcon from '../../../assets/images/others/profile.svg';
import Comment from '../../../assets/images/others/comment.svg';
import HeartIcon from '../../../assets/images/others/heart_empty.svg';
import HeartFillIcon from '../../../assets/images/others/heart_fill.svg';
import HeartEmptyIcon from '../../../assets/images/others/heart_empty.svg';

const { width, height } = Dimensions.get("window");
const W = width;
const H = height;

const FeedItem = ({
  id, boardWriter, boardCreatedAt, boardContent, islike,
  commentCount, boardImage, profileImage, onPress
}) => {
  return (
    <ItemContainer onPress={onPress}>
      <ProfileContainer>
        <ProfileImageContainer>
          {profileImage ? (
            <ProfilePhoto source={{ uri: profileImage }} />
          ) : (
            <ProfileIcon width={W * 0.08} height={W * 0.08} />
          )}
        </ProfileImageContainer>
        <ProfileTextContainer>
          <Writer>{boardWriter}</Writer>
          <PostInfo>{boardCreatedAt}</PostInfo>
        </ProfileTextContainer>
      </ProfileContainer>

      <Content>{boardContent}</Content>

      {boardImage && (
        <BoardImage
          source={typeof boardImage === "string" ? { uri: boardImage } : boardImage}
        />
      )}

      <StatsContainer>
        <StatItem>
          {islike ? <HeartFillIcon /> : <HeartEmptyIcon />}
        </StatItem>
        <StatItem>
          <Comment />
          <StatText>{commentCount}</StatText>
        </StatItem>
      </StatsContainer>
    </ItemContainer>
  );
};

export default memo(FeedItem);

const ItemContainer = styled.TouchableOpacity`
  background-color: ${colors.white};
  border-bottom-width: 1px;
  border-bottom-color: ${colors.gray200};
  margin: 1% 7%;
`;

const ProfileContainer = styled.View`
  flex-direction: row;
  align-items: flex-end;
  margin-top: ${H * 0.02}px;
  margin-bottom: ${H * 0.02}px;
`;
const ProfilePhoto = styled.Image`
  width: ${W * 0.15}px;
  height: ${W * 0.15}px;
  border-radius: 50px;
`;
const ProfileImageContainer = styled.View`
  width: ${W * 0.15}px;
  height: ${W * 0.15}px;
  align-items: center;
  justify-content: center;
  border-radius: 50px;
  background-color: ${colors.gray200};
`;

const ProfileTextContainer = styled.View`
  margin-left: ${W * 0.035}px;
`;

const Writer = styled.Text`
  font-size: ${W * 0.04}px;
  font-family: "NPSfont_bold";
  color: ${colors.black};
  margin-bottom: 3%;
`;

const PostInfo = styled.Text`
  font-size: ${W * 0.034}px;
  font-family: "NPSfont_regular";
  color: ${colors.gray300};
`;

const Content = styled.Text`
  font-size: ${W * 0.038}px;
  font-family: "NPSfont_regular";
  color: ${colors.brown};
  margin: 2%;
  margin-bottom: 10px;
  line-height: 20px;
`;

const BoardImage = styled.Image`
  width: ${W * 0.9}px;
  height: ${W * 0.9}px;
  border-radius: 10px;
  align-self: center;
  margin: 2%;
`;

const StatsContainer = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin: 1%;
  margin-bottom: 5%;
`;

const StatItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-right: 2%;
`;

const StatText = styled.Text`
  font-size: ${W * 0.038}px;
  color: ${colors.brown};
  padding: 1%;
  font-family: "NPSfont_regular";
`;
