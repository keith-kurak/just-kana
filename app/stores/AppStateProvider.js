import { createContext, useState, useContext, useCallback } from 'react';

//create a context, with createContext api
export const AppStateContext = createContext();

const AppStateProvider = (props) => {
  const [savedWords, setSavedWords] = useState([]);

  const addWord = useCallback(wordKana => {
    const newSavedWords = savedWords.slice();
    newSavedWords.push(wordKana);
    setSavedWords(newSavedWords);
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