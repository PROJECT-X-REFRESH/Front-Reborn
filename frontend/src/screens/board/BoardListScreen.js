import React, { useState, useCallback, useEffect } from 'react';
import { Dimensions, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import styled from 'styled-components/native';

import { fetchBoardList, fetchPopularBoards, fetchLikedBoards, BOARD_TYPE } from '../../services/boardapi';
import FeedItem from './items/FeedItem';
import RecordWhiteIcon from '../../assets/images/others/record_white.svg';
import colors from '../../constants/colors';

const { width: W, height: H } = Dimensions.get('window');

const BoardListScreen = ({ navigation, route }) => {
  const [category, setCategory] = useState(route.params?.category ?? 'POST');
  const [selectedScreen, setSelectedScreen] = useState('all');
  const [feedItemData, setFeedItemData] = useState([]);

  useEffect(() => {
    if (route.params?.category && route.params.category !== category) {
      setCategory(route.params.category);
      setSelectedScreen('all');
    }
  }, [route.params?.category]);

  const loadBoardData = useCallback(async () => {
    try {
      let boardData = [];

      if (selectedScreen === 'popular') {
        boardData = await fetchPopularBoards(category);
      } else if (selectedScreen === 'like') {
        boardData = await fetchLikedBoards(category);
      } else {
        boardData = await fetchBoardList({ type: BOARD_TYPE[category] });
      }

      const mapped = boardData.map(item => ({
        id: item.id,
        boardWriter: item.writerName,
        boardCreatedAt: item.createdAt?.substring(0, 16).replace('T', ' ') || '',
        boardContent: item.content,
        islike: item.like ?? false,
        likeCount: item.likeCount ?? 0,
        commentCount: item.commentCount ?? 0,
        boardImage: item.attachImg || null,
        profileImage: item.writerProfileImage || null,
      }));

      setFeedItemData(mapped);
    } catch (error) {
      console.error('게시글 목록 로딩 실패:', error.message);
    }
  }, [selectedScreen, category]);

  useFocusEffect(
    useCallback(() => {
      loadBoardData();
    }, [selectedScreen, category])
  );

  const renderItem = ({ item }) => (
    <FeedItem
      {...item}
      navigation={navigation}
      onPress={() => navigation.navigate('BoardDetailScreen', {
        boardId: item.id,
        category,
      })}
    />
  );

  return (
    <Container>
      <CategorySelector selectedScreen={selectedScreen} onSelect={setSelectedScreen} />

      <FlatList
        data={feedItemData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 200 }}
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        windowSize={10}
        removeClippedSubviews
        showsVerticalScrollIndicator={false}
      />

      <WriteButton onPress={() => navigation.navigate('BoardWrite', { category })}>
        <RecordWhiteIcon width={24} height={24} />
      </WriteButton>
    </Container>
  );
};

export default BoardListScreen;

const Container = styled.View`
  flex: 1;
  background-color: ${colors.white};
`;

const HeaderContainer = styled.View`
  flex-direction: row;
  margin-top: ${H * 0.01}px;
  padding: ${H * 0.005}px ${W * 0.08}px;
`;

const ScreenText = styled.Text`
  font-size: ${W * 0.04}px;
  margin: 13px;
  font-family: 'NPSfont_extrabold';
  padding: 2%;
  color: ${({ selected }) => (selected ? colors.lightBrown : colors.brown)};
`;

const ScreenItem = styled.View`
  border-bottom-width: ${({ selected }) => (selected ? '3px' : '0px')};
  border-bottom-color: ${colors.brown};
  padding-bottom: 5px;
  padding: ${H * 0.001}px ${W * 0.05}px;
`;

const WriteButton = styled.TouchableOpacity`
  position: absolute;
  bottom: ${H * 0.03}px;
  right: ${W * 0.06}px;
  background-color: ${colors.brown};
  width: ${W * 0.14}px;
  height: ${W * 0.14}px;
  border-radius: ${W * 0.07}px;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

const CategorySelector = React.memo(({ selectedScreen, onSelect }) => (
  <HeaderContainer>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {['all', 'popular', 'like'].map((screen) => (
        <TouchableOpacity key={screen} onPress={() => onSelect(screen)}>
          <ScreenItem selected={selectedScreen === screen}>
            <ScreenText selected={selectedScreen === screen}>
              {screen === 'all' ? '전체글' : screen === 'popular' ? '인기글' : '좋아요'}
            </ScreenText>
          </ScreenItem>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </HeaderContainer>
));