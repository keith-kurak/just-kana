import { createContext, useState, useContext, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DateTime } from 'luxon';
import { useTheme } from '../config/styles';

// clear storage for testing
//AsyncStorage.setItem('@saved_words', JSON.stringify([]));

// set demo data
const demoData = `[{"word":[{"kana":"ア","romaji":"a"},{"kana":"メ","romaji":"me"},{"kana":"リ","romaji":"ri"},{"kana":"カ","romaji":"ka"}],"date":"2023-02-12T01:14:22.721-05:00"},{"word":[{"kana":"カ","romaji":"ka"},{"kana":"ナ","romaji":"na"},{"kana":"ダ","romaji":"da"}],"date":"2023-02-12T01:14:50.284-05:00"},{"word":[{"kana":"フ","romaji":"fu"},{"kana":"ラ","romaji":"ra"},{"kana":"ン","romaji":"n"},{"kana":"ス","romaji":"su"}],"date":"2023-02-12T01:21:39.087-05:00"},{"word":[{"kana":"イ","romaji":"i"},{"kana":"ギ","romaji":"gi"},{"kana":"リ","romaji":"ri"},{"kana":"ス","romaji":"su"}],"date":"2023-02-12T01:22:45.659-05:00"}]`;
AsyncStorage.setItem('@saved_words', demoData);

const initialSettings = {
  showVowelsAndConsonants: true,
  primaryColorIndex: 0,
  onboardingsCompleted: [],
};

//create a context, with createContext api
export const AppStateContext = createContext();

const AppStateProvider = (props) => {
  const { setPrimaryColorIndex } = useTheme();
  const [settings, setSettings] = useState(initialSettings);
  const [savedWords, setSavedWords] = useState([]);
  // hack to wait for theme to be set
  const [isLoaded, setIsLoaded] = useState(false);

  // load initial data
  useEffect(() => {
    (async function doStuff() {
      const wordsJson = await AsyncStorage.getItem('@saved_words');
      setSavedWords(wordsJson != null ? JSON.parse(wordsJson) : []);

      const settingsJson = await AsyncStorage.getItem('@settings');
      const mySettings =
        settingsJson != null
          ? { ...initialSettings, ...JSON.parse(settingsJson) }
          : initialSettings;
      setSettings(mySettings);
      // update primary color if not default
      setPrimaryColorIndex(mySettings.primaryColorIndex);
      setIsLoaded(true);
    })();
  }, []);

  // save words to local storage
  const addWord = useCallback(
    (wordKana) => {
      const newSavedWords = savedWords.slice();
      newSavedWords.push({ word: wordKana, date: DateTime.local().toISO() });
      setSavedWords(newSavedWords);
      const jsonValue = JSON.stringify(newSavedWords);
      AsyncStorage.setItem('@saved_words', jsonValue);
    },
    [savedWords]
  );

  const deleteWord = useCallback(
    (word) => {
      const newSavedWords = savedWords.filter((savedWord) => savedWord !== word);
      setSavedWords(newSavedWords);
      const jsonValue = JSON.stringify(newSavedWords);
      AsyncStorage.setItem('@saved_words', jsonValue);
    },
    [savedWords]
  );

  function updateSettings(newSettings) {
    setSettings(newSettings);
    const jsonValue = JSON.stringify(newSettings);
    AsyncStorage.setItem('@settings', jsonValue);
  }

  const completeOnboarding = useCallback(
    (onboardingName) => {
      const newSettings = { ...settings };
      newSettings.onboardingsCompleted.push(onboardingName);
      updateSettings(newSettings);
    },
    [settings]
  );

  // settings
  const setSetting = useCallback(
    (key, value) => {
      let myValue = value;
      if (key === 'primaryColorIndex') {
        if (myValue > 4) {
          myValue = 0;
        }
        setPrimaryColorIndex(myValue);
      }
      const newSettings = { ...settings };
      newSettings[key] = myValue;
      updateSettings(newSettings);
    },
    [settings, setPrimaryColorIndex]
  );

  const onDeleteAll = useCallback(() => {
    setSavedWords([]);
    AsyncStorage.setItem('@saved_words', JSON.stringify([]));
  }, []);

  return (
    // this is the provider providing state
    <AppStateContext.Provider
      value={{
        savedWords,
        addWord,
        setSetting,
        settings,
        deleteWord,
        isLoaded,
        initialOnboardingRequired: !settings.onboardingsCompleted.find((i) => 'firstTime'),
        completeOnboarding,
        onDeleteAll,
      }}>
      {props.children}
    </AppStateContext.Provider>
  );
};

function useAppState() {
  return useContext(AppStateContext);
}

export { AppStateProvider, useAppState };
