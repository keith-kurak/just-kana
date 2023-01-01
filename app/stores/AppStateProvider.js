import { createContext, useState, useContext, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DateTime} from 'luxon';

//AsyncStorage.setItem('@saved_words', JSON.stringify([]));

//create a context, with createContext api
export const AppStateContext = createContext();

const AppStateProvider = (props) => {
  const [savedWords, setSavedWords] = useState([]);

  const [settings, setSettings] = useState({ showVowelsAndConsonants: true });

  useEffect(() => {
    (async function doStuff() {
      const jsonValue = await AsyncStorage.getItem('@saved_words')
      setSavedWords(jsonValue != null ? JSON.parse(jsonValue) : []);
    })();
  }, [])

  const addWord = useCallback(wordKana => {
    const newSavedWords = savedWords.slice();
    newSavedWords.push({ word: wordKana, date: DateTime.local().toISO() });
    setSavedWords(newSavedWords);
    const jsonValue = JSON.stringify(newSavedWords)
    AsyncStorage.setItem('@saved_words', jsonValue);
  });

  const setSetting = useCallback((key, value) => {
    const newSettings = { ...settings };
    newSettings[key] = value;
    setSettings(newSettings);
  }, [settings]);

    return (
                // this is the provider providing state
        <AppStateContext.Provider value={{savedWords, addWord, setSetting, settings }}>
            {props.children}
        </AppStateContext.Provider>
    );
};

function useAppState() {
  return useContext(AppStateContext);
};


export { AppStateProvider, useAppState };