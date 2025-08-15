import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';

const RebornContext = createContext();

export const useReborn = () => useContext(RebornContext);

export const RebornProvider = ({children}) => {
  const [petName, setPetName] = useState('');
  const [petColor, setPetColor] = useState('WHITE');
  const [petCase, setPetCase] = useState('DOG');
  const [chooseRibbon, setChooseRibbon] = useState('YELLOW'); // 선택한 리본

  const [progress, setProgress] = useState('intro');
  const [fstep, setFstep] = useState(null);
  const [farewellId, setFarewellId] = useState(0);

  const [isTimeToNext, setIsTimeToNext] = useState(false);
  const [isAllClear, setIsAllClear] = useState(false);
  const [isWalk, setIsWalk] = useState(false);
  const [isFeed, setIsFeed] = useState(false);
  const [isSnack, setIsSnack] = useState(false);
  const [isContents1, setIsContents1] = useState(false);
  const [isContents2, setIsContents2] = useState(false);

  useEffect(() => {
    console.log('📍 progress 변경:', progress);
  }, [progress]);

  useEffect(() => {
    console.log('📍 fstep 변경:', fstep);
  }, [fstep]);

  useEffect(() => {
    console.log('📍 isWalk 변경:', isWalk);
  }, [isWalk]);

  useEffect(() => {
    console.log('📍 isFeed 변경:', isFeed);
  }, [isFeed]);

  useEffect(() => {
    console.log('📍 isSnack 변경:', isSnack);
  }, [isSnack]);

  useEffect(() => {
    console.log('📍 isContents1 변경:', isContents1);
  }, [isContents1]);

  useEffect(() => {
    console.log('📍 isContents2 변경:', isContents2);
  }, [isContents2]);

  useEffect(() => {
    console.log('📍 farewellId 변경:', farewellId);
  }, [farewellId]);

  useEffect(() => {
    if (isTimeToNext) {
      setProgress(prev => `${prev}_next`);
    }
  }, [isTimeToNext]);

  // 컨텐츠 완료 시 초기화
  useEffect(() => {
    if (progress === 'remember_next') {
      if (
        isAllClear &&
        isFeed &&
        isWalk &&
        isSnack &&
        isContents1 &&
        isContents2
      ) {
        resetStates();
        return;
      }
    } else {
      if (isAllClear && isFeed && isWalk && isSnack && isContents1) {
        resetStates();
        return;
      }
    }

    if (progress === 'remember') {
      if (isWalk && isFeed && isSnack && isContents1 && isContents2) {
        setIsTimeToNext(true);
      }
    } else {
      if (isWalk && isFeed && isSnack && isContents1) {
        setIsTimeToNext(true);
      }
    }
  }, [
    progress,
    isFeed,
    isWalk,
    isSnack,
    isContents1,
    isContents2,
    isAllClear,
    resetStates,
  ]);

  const resetStates = useCallback(() => {
    setIsWalk(false);
    setIsFeed(false);
    setIsSnack(false);
    setIsContents1(false);
    setIsContents2(false);
    setIsAllClear(false);
    setIsTimeToNext(false);
  }, []);

  const ResetRebornContext = () => {
    setProgress('intro');
    setFstep(null);
    setFarewellId(0);
    setPetName('');
    setIsTimeToNext(false);
    setIsAllClear(false);
    setIsWalk(false);
    setIsFeed(false);
    setIsSnack(false);
    setIsContents1(false);
    setIsContents2(false);
  };

  const value = useMemo(
    () => ({
      progress,
      setProgress,
      fstep,
      setFstep,
      farewellId,
      setFarewellId,
      petName,
      setPetName,
      isWalk,
      setIsWalk,
      isFeed,
      setIsFeed,
      isSnack,
      setIsSnack,
      isContents1,
      setIsContents1,
      isContents2,
      setIsContents2,
      setIsAllClear,
      isTimeToNext,
      setIsTimeToNext,
      ResetRebornContext,
      petColor,
      setPetColor,
      petCase,
      setPetCase,
      chooseRibbon,
      setChooseRibbon,
    }),
    [
      progress,
      fstep,
      farewellId,
      petName,
      isWalk,
      isFeed,
      isSnack,
      isContents1,
      isContents2,
      isTimeToNext,
      petColor,
      petCase,
      chooseRibbon,
    ],
  );

  return (
    <RebornContext.Provider value={value}>{children}</RebornContext.Provider>
  );
};
