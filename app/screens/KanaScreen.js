import React, { useState, useCallback } from 'react';
import KanaList from '../components/KanaList';
import { useAppState } from '../stores';

export default function ({ navigation }) {
  const { savedWords, addWord } = useAppState();
  const [typingKana, setTypingKana] = useState([]);

  const onPressKey = useCallback((key) => {
    if (key === '<') {
      if (typingKana.length === 1) {
        setTypingKana([]);
      } else {
        setTypingKana(typingKana.slice(0, typingKana.length - 1));
      }
    }
    if (key === '_') {
      const newTypingKana = typingKana.slice();
      newTypingKana.push({
        kana: ' ',
        romaji: ' ',
      });
      setTypingKana(newTypingKana);
    }
    if (key === '+') {
      addWord(typingKana);
      setTypingKana([]);
    }
  });

  const onPressKana = useCallback((kana) => {
    const newTypingKana = typingKana.slice();
    newTypingKana.push(kana);
    setTypingKana(newTypingKana);
  });

  return (
    <KanaList
      typingKana={typingKana}
      onPressKana={onPressKana}
      savedWords={savedWords}
      onPressKeyboardKey={onPressKey}
      onPressShowWordList={() => navigation.navigate('Words')}
    />
  );
}
