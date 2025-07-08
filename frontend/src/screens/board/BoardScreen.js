import React, { useEffect, useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { fetchBoardList, fetchPopularBoards, fetchLikedBoards, BOARD_TYPE } from '../../services/boardapi';
import styled from "styled-components/native";
import { Dimensions, TouchableOpacity, FlatList, ScrollView } from "react-native";
import colors from "../../constants/colors";
import FeedItem from "./items/FeedItem";
import RecordWhiteIcon from '../../assets/images/others/record_white.svg';

const { width, height } = Dimensions.get("window");
const W = width;
const H = height;

const BoardScreen = ({ navigation }) => {
  const [feedItemData, setFeedItemData] = useState([]);
  const [selectedScreen, setSelectedScreen] = useState("all");

  const loadBoardData = useCallback(async () => {
    let boardData = [];

    try {
      if (selectedScreen === 'popular') {
        boardData = await fetchPopularBoards('POST');
      } else if (selectedScreen === 'like') {
        boardData = await fetchLikedBoards('POST');
      } else {
        boardData = await fetchBoardList({ type: BOARD_TYPE.POST });
      }
      //console.log("게시글 목록:", boardData);
      const mapped = boardData.map(item => {
        const formattedTime = item.createdAt
          ? item.createdAt.substring(0, 16).replace('T', ' ')
          : '';

        return {
          id: item.id,
          boardWriter: item.writerName,
          boardCreatedAt: formattedTime,
          boardContent: item.content,
          islike: item.like ?? false,
          likeCount: item.likeCount ?? 0,
          commentCount: item.commentCount ?? 0,
          boardImage: item.attachImg || null,
          profileImage: item.writerProfileImage || null,
        };
      });

      setFeedItemData(mapped);
    } catch (error) {
      console.error('게시글 목록 로딩 실패:', error.message);
    }
  }, [selectedScreen]);

  useFocusEffect(
    useCallback(() => {
      loadBoardData();
    }, [selectedScreen])
  );


  const renderItem = useCallback(
    ({ item }) => (
      <FeedItem
        id={item.id}
        boardWriter={item.boardWriter}
        boardCreatedAt={item.boardCreatedAt}
        boardContent={item.boardContent}
        navigation={navigation}
        islike={item.islike}
        likeCount={item.likeCount}
        commentCount={item.commentCount}
        boardImage={item.boardImage}
        profileImage={item.profileImage}
        onPress={() =>
          navigation.navigate('BoardDetailScreen', {
            boardId: item.id,
            category: 'POST',
          })
        }
      />
    ),
    [navigation]
  );

  const CategorySelector = React.memo(({ selectedScreen, onSelect }) => (
    <HeaderContainer>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {["all", "popular", "like"].map((screen) => (
          <TouchableOpacity key={screen} onPress={() => onSelect(screen)}>
            <ScreenItem selected={selectedScreen === screen}>
              <ScreenText selected={selectedScreen === screen}>
                {screen === "all" ? "전체글" : screen === "popular" ? "인기글" : "좋아요"}
              </ScreenText>
            </ScreenItem>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </HeaderContainer>
  ));

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
        removeClippedSubviews={true}
        showsVerticalScrollIndicator={false}
      />
      <WriteButton
        onPress={() =>
          navigation.navigate('BoardWrite', { category: 'POST' })
        }>
        <RecordWhiteIcon width={24} height={24} />
      </WriteButton>
    </Container>
  );
};

export default BoardScreen;

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
  font-family: "NPSfont_extrabold";
  padding: 2%;
  color: ${({ selected }) => (selected ? colors.lightBrown : colors.brown)};
`;

const ScreenItem = styled.View`
  border-bottom-width: ${({ selected }) => (selected ? "3px" : "0px")};
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
