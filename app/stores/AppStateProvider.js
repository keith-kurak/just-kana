import { createContext, useState, useContext, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DateTime } from 'luxon';
import { useTheme } from '../config/styles';

// clear storage for testing
//AsyncStorage.setItem('@saved_words', JSON.stringify([]));

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
