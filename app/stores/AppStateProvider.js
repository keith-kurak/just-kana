import { createContext, useState, useContext, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

//create a context, with createContext api
export const AppStateContext = createContext();

const AppStateProvider = (props) => {
  const [savedWords, setSavedWords] = useState([]);

  useEffect(() => {
    (async function doStuff() {
      const jsonValue = await AsyncStorage.getItem('@saved_words')
      setSavedWords(jsonValue != null ? JSON.parse(jsonValue) : []);
    })();
  }, [])

  const addWord = useCallback(wordKana => {
    const newSavedWords = savedWords.slice();
    newSavedWords.push(wordKana);
    setSavedWords(newSavedWords);
    const jsonValue = JSON.stringify(newSavedWords)
    AsyncStorage.setItem('@saved_words', jsonValue);
  })

    return (
                // this is the provider providing state
        <AppStateContext.Provider value={{savedWords, addWord }}>
            {props.children}
        </AppStateContext.Provider>
    );
};

function useAppState() {
  return useContext(AppStateContext);
};


export { AppStateProvider, useAppState };