import React from 'react';
import styled from 'styled-components/native';
import colors from '../../../constants/colors';

import { Dimensions, TouchableOpacity } from 'react-native';
import { NpsText } from '../../../components/CustomText';

import User from '../../../assets/images/others/add_img.svg'

const { width, height } = Dimensions.get('window');

const ReturnPostItem = ({ post, navigation }) => {
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('ReturnPostNavigator', {
          screen: 'ReturnPostScreen',
          params: { postId: post.id },
        })
      }
    >
      <PostItem>
        {post.imgUrl ? (
          <PostImage
            source={{ uri: post.imgUrl }} />
        ) : <User width={width * 0.14} height={width * 0.15} />}
        <PostText numberOfLines={2}>{post.title}</PostText>
      </PostItem>
    </TouchableOpacity>
  );
};

const PostItem = styled.View`
  flex-direction: row;
  align-items: center;
  padding: ${height * 0.015}px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.gray200};
`;

const PostImage = styled.Image`
  width: ${width * 0.12}px;
  height: ${width * 0.12}px;
  margin-right: ${width * 0.01}px;
  border-radius: 5px;
`;


const PostText = styled(NpsText)`
  font-size: ${width * 0.04}px;
  color: ${colors.brown};
  margin-left: ${width * 0.02}px;
  flex: 1;
  flex-shrink: 1;
`;



export default ReturnPostItem;
