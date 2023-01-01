import React, { useState, useCallback } from 'react';
import { View } from 'react-native';
import KanaList from '../components/kana-list';
import TopStatusBar from '../components/TopStatusBar';
import KanaTypingOverlay from '../components/KanaTypingOverlay';
import { useAppState } from '../stores';
import { useStyles } from '../config/styles';

export default function ({ navigation }) {
  const { savedWords, addWord, settings, setSetting } = useAppState();
  const [typingKana, setTypingKana] = useState([]);
  const { colors } = useStyles();

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
    <View style={{ flex: 1, backgroundColor: colors.backgroundColor }}>
      <KanaList
        onPressKana={onPressKana}
        showConsonants={settings['showVowelsAndConsonants']}
      />
      <KanaTypingOverlay typingKana={typingKana} onPressKey={onPressKey} />
      <TopStatusBar
        showVowels={settings['showVowelsAndConsonants']}
        savedWords={savedWords}
        onPressShowWordList={() => navigation.navigate('Words')}
        onChangeSetting={setSetting}
      />
    </View>
  );
}
