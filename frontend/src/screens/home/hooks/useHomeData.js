import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import { get } from '../../../services/api';
import config from '../../../constants/config';
import AnimalImages from '../../../components/AnimalImages';

const SELECTED_PET_KEY = 'selectedPetId';

export default function useHomeData() {
  const [state, setState] = useState({
    userName: '',
    selectedPet: null,
    pets: [],
    posts: [],
    die: null,
    rebornScreen: 'IntroOutroScreen',
  });

  const saveSelectedPetId = id => AsyncStorage.setItem(SELECTED_PET_KEY, String(id));
  const loadSelectedPetId = async () => {
    const id = await AsyncStorage.getItem(SELECTED_PET_KEY);
    return id ? parseInt(id, 10) : null;
  };

  const fetchFarewellProgress = async (progress, farewellId, rebornFns) => {
    try {
      const accessData = await Keychain.getGenericPassword();
      const tokenObj = JSON.parse(accessData?.password);
      const accessToken = tokenObj.accessToken;

      const res = await get(config[progress].VIEW(farewellId), {}, {
        headers: { Authorization: `${accessToken}` },
      });

      if (!res?.isSuccess) return;

      if (progress === 'REBIRTH') {
        rebornFns.setProgress(res.result.nextStep);
        if (res.result.nextStep === 'letter') rebornFns.setChooseRibbon(res.result.ribbon);
      } else {
        rebornFns.setIsFeed(res.result.feed);
        rebornFns.setIsWalk(res.result.walk);
        rebornFns.setIsSnack(res.result.snack);
        rebornFns.setIsContents1(res.result.contents1);
        rebornFns.setIsContents2(res.result.contents2);
      }
    } catch (error) {
      console.error('작별하기 진행상황 요청 에러:', error);
    }
  };

  const setProgressByfstep = (fstep, farewellId, rebornFns) => {
    let progress = 'intro';
    if (fstep === 1) progress = 'recognize';
    else if ([2, 3, 4].includes(fstep)) progress = 'reveal';
    else if ([5, 6].includes(fstep)) progress = 'remember';
    else if (fstep === 7) progress = 'rebirth';
    else if (fstep > 7) progress = 'end';

    rebornFns.setProgress(progress);

    let screen = 'IntroOutroScreen';
    if (fstep && fstep === 7 && farewellId !== 0) {
      screen = 'RebirthScreen';
      fetchFarewellProgress(progress.toUpperCase(), farewellId, rebornFns);
    } else if (fstep < 7 && fstep > 0 && farewellId !== 0) {
      screen = 'RebornMainScreen';
      fetchFarewellProgress(progress.toUpperCase(), farewellId, rebornFns);
    }

    setState(prev => ({ ...prev, rebornScreen: screen }));
  };

  const fetchMain = useCallback(async (rebornFns, setPetId) => {
    try {
      const res = await get(config.USERS.MAIN);
      const petList = res.result.petList || [];

      const formattedPets = petList.map(p => ({
        id: p.id,
        name: p.name,
        fstep: p.fstep,
        farewellId: p.farewellId,
        petCase: p.petCase,
        birth: p.birth,
        die: !!p.death,
        color: p.color,
        todayRemind: p.todayRemind,
        todayRecord: p.todayRecord,
        image: AnimalImages[p.petCase]?.[p.color]?.profile,
      }));

      const storedPetId = await loadSelectedPetId();
      const currentPet = formattedPets.find(p => p.id === storedPetId) ?? formattedPets[0];

      setState(prev => ({
        ...prev,
        userName: res.result.name,
        pets: formattedPets,
        posts: res.result.aiPost || [],
        selectedPet: currentPet,
        die: currentPet?.die ? 3 : null,
      }));

      if (currentPet) {
        saveSelectedPetId(currentPet.id);
        rebornFns.ResetRebornContext();
        setPetId(currentPet.id);
        rebornFns.setPetCase(currentPet.petCase);
        rebornFns.setPetColor(currentPet.color);
        rebornFns.setPetName(currentPet.name);
        rebornFns.setFstep(currentPet.fstep);
        rebornFns.setFarewellId(currentPet.farewellId);
        setProgressByfstep(currentPet.fstep, currentPet.farewellId, rebornFns);
      }
    } catch (e) {
      console.error('메인 화면 데이터 불러오기 실패:', e);
    }
  }, []);

  return { state, setState, fetchMain, saveSelectedPetId };
}
