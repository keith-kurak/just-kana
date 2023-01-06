import { createContext, useState, useContext, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DateTime } from 'luxon';
//import { useTranslator } from 'react-native-translator';

//AsyncStorage.setItem('@saved_words', JSON.stringify([]));

//create a context, with createContext api
export const AppStateContext = createContext();

const AppStateProvider = (props) => {
  const [savedWords, setSavedWords] = useState([]);

  // load initial data
  useEffect(() => {
    (async function doStuff() {
      const jsonValue = await AsyncStorage.getItem('@saved_words');
      setSavedWords(jsonValue != null ? JSON.parse(jsonValue) : []);
    })();
  }, []);

  // save words to local storage
  const addWord = useCallback((wordKana) => {
    const newSavedWords = savedWords.slice();
    newSavedWords.push({ word: wordKana, date: DateTime.local().toISO() });
    setSavedWords(newSavedWords);
    const jsonValue = JSON.stringify(newSavedWords);
    AsyncStorage.setItem('@saved_words', jsonValue);
  });

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

  // settings (in memory for now)
  const [settings, setSettings] = useState({ showVowelsAndConsonants: true });
  const setSetting = useCallback(
    (key, value) => {
      const newSettings = { ...settings };
      newSettings[key] = value;
      setSettings(newSettings);
    },
    [settings]
  );

  return (
    // this is the provider providing state
    <AppStateContext.Provider
      value={{ savedWords, addWord, setSetting, settings }}>
      {props.children}
    </AppStateContext.Provider>
  );
};

function useAppState() {
  return useContext(AppStateContext);
}

export { AppStateProvider, useAppState };
