import React from 'react';
import styled from 'styled-components/native';
import { FlatList } from 'react-native';
import { NpsText } from '../../../components/CustomText';
import colors from '../../../constants/colors';
import { Dimensions } from 'react-native';
import ReturnPostItem from '../item/ReturnPostItem';

const { width, height } = Dimensions.get('window');

const ReturnPostList = ({ posts, navigation }) => {
  return (
    <Section>
      <SectionTitle>
        오늘의 <HighlightText>RE</HighlightText>TURN 포스트
      </SectionTitle>
      <FlatList
        data={posts}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <ReturnPostItem post={item} navigation={navigation} />
        )}
      />
    </Section>
  );
};

export default ReturnPostList;

const Section = styled.View`
  margin-bottom: ${height * 0.03}px;
`;

const SectionTitle = styled(NpsText)`
  font-size: ${width * 0.045}px;
  font-family: 'NPSfont_extrabold';
  color: ${colors.brown};
  margin-top: ${height * 0.015}px;
  margin-bottom: ${height * 0.015}px;
`;

const HighlightText = styled(NpsText)`
  color: ${colors.yellow};
  font-family: 'NPSfont_extrabold';
`;
