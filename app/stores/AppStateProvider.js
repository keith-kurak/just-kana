import { createContext, useState, useContext, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DateTime } from 'luxon';
import { useTheme } from '../config/styles';
//import { useTranslator } from 'react-native-translator';

//AsyncStorage.setItem('@saved_words', JSON.stringify([]));

//create a context, with createContext api
export const AppStateContext = createContext();

const AppStateProvider = (props) => {
  const { primaryColorIndex, setPrimaryColorIndex } = useTheme();
  const [settings, setSettings] = useState({ showVowelsAndConsonants: true, primaryColorIndex });
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
          ? JSON.parse(settingsJson)
          : { showVowelsAndConsonants: true, primaryColorIndex };
      setSettings(mySettings);
      // update primary color if not default
      setPrimaryColorIndex(mySettings.primaryColorIndex);
      setIsLoaded(true);
    })();
  }, []);

  // save words to local storage
  const addWord = useCallback((wordKana) => {
    const newSavedWords = savedWords.slice();
    newSavedWords.push({ word: wordKana, date: DateTime.local().toISO() });
    setSavedWords(newSavedWords);
    const jsonValue = JSON.stringify(newSavedWords);
    AsyncStorage.setItem('@saved_words', jsonValue);
  },[savedWords]);

  const deleteWord = useCallback((word) => {
    const newSavedWords = savedWords.filter((savedWord) => savedWord !== word);
    setSavedWords(newSavedWords);
    const jsonValue = JSON.stringify(newSavedWords);
    AsyncStorage.setItem('@saved_words', jsonValue);
  }, [savedWords]);

  // request translation of word, save its translation
  // TODO: save to local storage
  /*const { translate } = useTranslator();
  const requestTranslation = useCallback((word) => {
    (async function doAsync() {
      try {
        console.log(word)
        // super: 'スーパー マリオ'
        // https://translate.google.com/?sl=$ja&tl=$en&text=%E3%82%B9%E3%83%BC%E3%83%91%E3%83%BC%20%E3%83%9E%E3%83%AA%E3%82%AA
        const translation = await translate('ja', 'en', word, { type: 'papago', timeout: 10000 });
        console.log(translation);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);*/

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
      setSettings(newSettings);
      const jsonValue = JSON.stringify(newSettings);
      AsyncStorage.setItem('@settings', jsonValue);
    },
    [settings, setPrimaryColorIndex]
  );

  return (
    // this is the provider providing state
    <AppStateContext.Provider
      value={{ savedWords, addWord, setSetting, settings, deleteWord, isLoaded }}>
      {props.children}
    </AppStateContext.Provider>
  );
};

function useAppState() {
  return useContext(AppStateContext);
}

export { AppStateProvider, useAppState };
