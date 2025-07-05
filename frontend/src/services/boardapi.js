import { Alert } from 'react-native';
import config from '../constants/config';
import { get, post, del } from './api';

export const BOARD_TYPE = {
  POST: 'POST',
  SHARE: 'SHARE',
  VOLUNTEER: 'VOLUNTEER',
};

// 게시판 관련 API 호출 함수들
export const fetchBoardList = async ({
  type = BOARD_TYPE.POST,  //POST, SHARE, VOLUNTEER, ALL
  scrollPosition = 0,
  fetchSize = 50,
} = {}) => {
  try {
    const response = await get('/board/list', {
      type,
      scrollPosition,
      fetchSize,
    });

    if (response?.isSuccess && response?.result?.boardList) {
      return response.result.boardList;
    } else {
      throw new Error(response?.message || '게시글을 불러오지 못했습니다.');
    }
  } catch (error) {
    //console.error('게시글 목록 조회 에러:', error.message);
    return [];
  }
};

export const fetchBoardDetail = async (boardId) => {
  try {
    const response = await get(`/board/${boardId}`);
    if (response?.isSuccess && response?.result) {
      return response.result;
    } else {
      throw new Error(response?.message || '게시글 상세를 불러올 수 없습니다.');
    }
  } catch (error) {
    //console.error('게시글 상세 조회 에러:', error.message);
    throw error;
  }
};


export const fetchPopularBoards = async (type = 'ALL') => {
  try {
    const response = await get(config.BOARD.POPULAR(type));
    return response?.isSuccess && response?.result?.boardList
      ? response.result.boardList
      : [];
  } catch (error) {
    //console.error('인기글 조회 에러:', error.message);
    return [];
  }
};


export const fetchLikedBoards = async (type = 'ALL') => {
  try {
    const response = await get(config.BOARD.LIST_LIKED(type));
    return response?.isSuccess && response?.result?.boardList
      ? response.result.boardList
      : [];
  } catch (error) {
    //console.error('좋아요 글 조회 에러:', error.message);
    return [];
  }
};


export const fetchComments = async (boardId) => {
  try {
    const response = await get(config.COMMENT.LIST(boardId));
    if (response?.isSuccess && response?.result?.commentList) {
      return response.result.commentList;
    } else {
      throw new Error(response?.message || '댓글을 불러올 수 없습니다.');
    }
  } catch (error) {
    //console.error('댓글 조회 에러:', error.message);
    return [];
  }
};

export const createComment = async (boardId, contents) => {
  try {
    const response = await post(config.COMMENT.CREATE(boardId), { contents });
    return response;
  } catch (error) {
    //console.error('댓글 작성 실패:', error.message);
    throw error;
  }
};

export const deleteComment = async (commentId) => {
  try {
    const response = await del(config.COMMENT.DELETE(commentId));
    return response;
  } catch (error) {
    //console.error('댓글 삭제 실패:', error.message);
    //Alert.alert('권한 없음', '댓글 삭제는 작성자만 가능합니다.');
    throw error;
  }
};

export const toggleBoardLike = async (boardId) => {
  try {
    const response = await post(config.BOARDLIKE.TOGGLE(boardId));
    return response;
  } catch (error) {
    //console.error('좋아요 토글 실패:', error.message);
    throw error;
  }
};

export const fetchReturnPosts = async () => {
  try {
    const response = await get(config.USERS.MAIN); // 현재 이 경로에서 post 포함됨
    if (response?.isSuccess && response?.result?.post) {
      return response.result.post;
    } else {
      throw new Error(response?.message || 'RE:TURN 포스트를 불러올 수 없습니다.');
    }
  } catch (error) {
    //console.error('RE:TURN 포스트 조회 에러:', error.message);
    return [];
  }
};

// AI 포스트
export const fetchReturnPostDetail = async (postId) => {
  try {
    const response = await get(config.AIPOST.DETAIL(postId));
    if (response?.isSuccess && response?.result) {
      return response.result;
    } else {
      throw new Error(response?.message || '포스트 상세 정보를 가져오지 못했습니다.');
    }
  } catch (error) {
    //console.error('AI 포스트 상세 조회 실패:', error.message);
    throw error;
  }
};