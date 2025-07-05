const BASE_URL = 'http://api.x-reborn.com'; // 기본 API URL
const AI_BASE_URL = 'https://gunaguna.zapto.org'; // AI API URL

const config = {
  API_URL: BASE_URL,
  AI_URL: AI_BASE_URL,

  AI: {
    REBIRTH_MESSAGE: `${AI_BASE_URL}/api/rebirth_message`, //rebirth 편지 내용
    CHAT: `${AI_BASE_URL}/api/chatbot`, // 챗봇 API
    REMIND_MESSAGE: `${AI_BASE_URL}/api/make_remind_message`, //remind 질문
  },

  REMEMBER_NEXT: {
    CREATE: farewellId => `${BASE_URL}/farewell/${farewellId}/rebirth/create`, // Rebirth 생성
  },

  REBIRTH: {
    WRITE: farewellId => `${BASE_URL}/farewell/${farewellId}/rebirth/write`, // 반려동물 편지 저장
    UPDATE_STATUS: (farewellId, activityType) =>
      `${BASE_URL}/farewell/${farewellId}/rebirth/${activityType}`, // 컨텐츠 상태 변경
    VIEW: farewellId => `${BASE_URL}/farewell/${farewellId}/rebirth/view`, // Rebirth 진행 상황
  },

  PET: {
    UPDATE: petId => `${BASE_URL}/pet/update/${petId}`, // 반려동물 수정
    CREATE_PROFILE: `${BASE_URL}/pet/profile/create`, // 펫 프로필 만들기
    PET_INFO: petId => `${BASE_URL}/pet/${petId}`, // 반려동물 조회
    LIST: scrollPosition => `${BASE_URL}/pet/list/${scrollPosition}`, // 반려동물 목록 조회
    DELETE: petId => `${BASE_URL}/pet/delete/${petId}`, // 반려동물 삭제
  },

  RECOGNIZE_NEXT: {
    CREATE: farewellId => `${BASE_URL}/farewell/${farewellId}/reveal/create`, // Reveal 생성
  },
  REVEAL: {
    WRITE: farewellId => `${BASE_URL}/farewell/${farewellId}/reveal/write`, // 일기 작성
    UPDATE: (farewellId, activityType) =>
      `${BASE_URL}/farewell/${farewellId}/reveal/${activityType}`, // 컨텐츠 상태 변경
    VIEW: farewellId => `${BASE_URL}/farewell/${farewellId}/reveal/view`, // Reveal 진행 상황
  },

  BOARDLIKE: {
    TOGGLE: boardId => `${BASE_URL}/board/${boardId}/like/toggle`, // 게시물 좋아요
  },

  RECORD: {
    DETAIL: recordId => `${BASE_URL}/record/${recordId}`, // record 상세 조회
    UPDATE: recordId => `${BASE_URL}/record/${recordId}`, // record 수정
    CREATE: petId => `${BASE_URL}/record/${petId}/create`, // record 생성
    LIST: (petId, scrollPosition, fetchSize) =>
      `${BASE_URL}/record/list/${petId}/${scrollPosition}/${fetchSize}`, // record 목록 조회
    DELETE: (petId, recordId) => `${BASE_URL}/record/${petId}/${recordId}`, // record 삭제
  },

  REVEAL_NEXT: {
    CREATE: farewellId => `${BASE_URL}/farewell/${farewellId}/remember/create`, // Remember 생성
  },
  REMEMBER: {
    CREATE_DIARY: farewellId =>
      `${BASE_URL}/farewell/${farewellId}/remember/write`, // 그림 일기 생성
    UPDATE: (farewellId, activityType) =>
      `${BASE_URL}/farewell/${farewellId}/remember/${activityType}`, // 컨텐츠 상태 변경
    CLEAN_VIEW: farewellId =>
      `${BASE_URL}/farewell/${farewellId}/remember/status`,
    CLEAN: (farewellId, cleanType) =>
      `${BASE_URL}/farewell/${farewellId}/remember/clean/${cleanType}`, // 물품 정리
    VIEW: farewellId => `${BASE_URL}/farewell/${farewellId}/remember/view`, // Remember 진행 상황
  },

  TOKEN: {
    RETURN: `${BASE_URL}/token/return`, //authCode로 토큰 반환
    GENERATE: `${BASE_URL}/token/generate`, // 토큰 반환
    LOCAL: `${BASE_URL}/token/local`, // 임시 code로 토큰 반환 (GET)
  },

  RECOLLECTION: {
    WEEK: petId => `${BASE_URL}/recollection/week/${petId}`,
    TODAY: petId => `${BASE_URL}/recollection/today/${petId}`,
    ID: petId => `${BASE_URL}/recollection/id/${petId}`,
  },

  FAREWELL: {
    FSTEP_INCREASE: (farewellId, fstep) =>
      `${BASE_URL}/farewell/${farewellId}/nextday/${fstep}`,
    REVIEW_ALL: farewellId => `${BASE_URL}/farewell/${farewellId}/review`,
    REVIEW_REMEMBER: (farewellId, rememberId) =>
      `${BASE_URL}/farewell/${farewellId}/review/remember/${rememberId}`,
    REVIEW_RECOG: (farewellId, recognizeId) =>
      `${BASE_URL}/farewell/${farewellId}/review/recognize/${recognizeId}`,
    REVIEW_REBIRTH: (farewellId, rebirthId) =>
      `${BASE_URL}/farewell/${farewellId}/review/rebirth/${rebirthId}`,
    REVIEW_REVEAL: (farewellId, revealId) =>
      `${BASE_URL}/farewell/${farewellId}/review/reveal/${revealId}`,
    REVIEW_CARD: (farewellId, petId) =>
      `${BASE_URL}/farewell/${farewellId}/pet/${petId}`,
  },

  HEALTH: {
    CHECK: `${BASE_URL}/health`,
  },

  BOARD: {
    DETAIL: boardId => `${BASE_URL}/board/${boardId}`,
    UPDATE: boardId => `${BASE_URL}/board/${boardId}`,
    DELETE: boardId => `${BASE_URL}/board/${boardId}`,
    CREATE: `${BASE_URL}/board/create`,
    POPULAR: (type = 'ALL') => `${BASE_URL}/board/popular?type=${type}`,
    LIST_ALL: `${BASE_URL}/board/list`,
    LIST_LIKED: (type = 'ALL') => `${BASE_URL}/board/list/like?type=${type}`,
  },

  COMMENT: {
    CREATE: boardId => `${BASE_URL}/comment/${boardId}/create`,
    LIST: boardId => `${BASE_URL}/comment/${boardId}/list`,
    DELETE: commentId => `${BASE_URL}/comment/delete/${commentId}`,
  },

  USERS: {
    REISSUE_TOKEN: `${BASE_URL}/users/reissue`,
    NICKNAME: `${BASE_URL}/users/name/update`,
    UPLOAD_IMAGE: `${BASE_URL}/users/img/update`,
    MAIN: `${BASE_URL}/users/main`,
    INFO: `${BASE_URL}/users/info`,
    DELETE_ME: `${BASE_URL}/users/me`,
    LOGOUT: `${BASE_URL}/users/logout`,
    DELETE_IMAGE: `${BASE_URL}/users/img/delete`,
  },

  CHAT: {
    LOAD: chatId => `${BASE_URL}/chat/${chatId}`,
    OUT: chatId => `${BASE_URL}/chat/${chatId}`,
    LIST: `${BASE_URL}/chat/list`,
    HANDSHAKE: partnerId => `${BASE_URL}/chat/handshake/${partnerId}`,
  },

  AIPOST: {
    TOGGLE: postId => `${BASE_URL}/aipost/${postId}/bookmark`,
    LIST: `${BASE_URL}/aipost`,
    DETAIL: postId => `${BASE_URL}/aipost/${postId}`,
    RECENT: `${BASE_URL}/aipost/recent`,
    BOOKMARK: `${BASE_URL}/aipost/bookmark`,
  },

  REMIND: {
    DETAIL: remindId => `${BASE_URL}/remind/${remindId}`,
    UPDATE: remindId => `${BASE_URL}/remind/${remindId}`,
    CREATE: petId => `${BASE_URL}/remind/${petId}/create`,
    LIST: (petId, scrollPosition, fetchSize) =>
      `${BASE_URL}/remind/list/${petId}/${scrollPosition}/${fetchSize}`,
    DELETE: (petId, remindId) => `${BASE_URL}/remind/${petId}/${remindId}`,
  },

  RECOGNIZE: {
    CREATE: farewellId => `${BASE_URL}/farewell/${farewellId}/recognize/create`,
    VIEW: farewellId => `${BASE_URL}/farewell/${farewellId}/recognize/view`,
    UPDATE: (farewellId, activityType) =>
      `${BASE_URL}/farewell/${farewellId}/recognize/${activityType}`,
    SURVEY: farewellId => `${BASE_URL}/farewell/${farewellId}/recognize/score`,
    NEARBY: farewellId => `${BASE_URL}/farewell/${farewellId}/recognize/nearby`,
  },

  FCM: {
    PUSH: `${BASE_URL}/fcm/push`,
  },
};

export default config;
