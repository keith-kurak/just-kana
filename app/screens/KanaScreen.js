import React, { useState, useCallback } from 'react';
import { View } from 'react-native';
import KanaList from '../components/kana-list';
import TopBar from '../components/top-bar';
import KanaFormsOverlay from '../components/kana-list/KanaFormsOverlay';
import KanaTypingOverlay from '../components/KanaTypingOverlay';
import { useAppState } from '../stores';
import { useStyles } from '../config/styles';

export default function ({ navigation }) {
  const { savedWords, addWord, settings, setSetting, toggleKanaType, kanaType } = useAppState();
  // a word that is being typed
  const [typingKana, setTypingKana] = useState([]);
  // just peeking at a single letter
  const [longPressKana, setLongPressKana] = useState([]);
  const { colors } = useStyles();

  const onPressKey = useCallback(
    (key) => {
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
      // nabasu mark
      if (key === 'ー') {
        const newTypingKana = typingKana.slice();
        newTypingKana.push({
          kana: 'ー',
          romaji: '',
        });
        setTypingKana(newTypingKana);
      }
    },
    [typingKana, setTypingKana, addWord]
  );

  // typing
  const onPressKana = useCallback(
    (kana) => {
      const newTypingKana = typingKana.slice();
      newTypingKana.push(kana);
      setTypingKana(newTypingKana);
    },
    [typingKana, setTypingKana]
  );

  // long press extra context
  const onLongPressKana = useCallback(
    (kana) => {
      setLongPressKana([kana]);
    },
    [longPressKana, setLongPressKana]
  );

  const onFinishLongPressKana = useCallback(() => {
    if (longPressKana.length) {
      setLongPressKana([]);
    }
  }, [longPressKana, setLongPressKana]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.backgroundColor }}>
      <KanaList
        kanaType={kanaType}
        onLongPressKana={onLongPressKana}
        onPressKana={onPressKana}
        showConsonants={settings['showVowelsAndConsonants']}
      />
      <KanaFormsOverlay
        kana={longPressKana && longPressKana[0]}
        onPressKana={onPressKana}
        isVisible={longPressKana.length}
        onRequestHide={onFinishLongPressKana}
      />
      <KanaTypingOverlay typingKana={typingKana} onPressKey={onPressKey} />
      <TopBar
        showVowels={settings['showVowelsAndConsonants']}
        primaryColorIndex={settings['primaryColorIndex']}
        savedWords={savedWords}
        onPressShowWordList={() => navigation.navigate('Words')}
        onChangeSetting={setSetting}
        typingKana={typingKana}
        peekingKana={[]}
        onPressKanaType={toggleKanaType}
        kanaType={kanaType}
      />
    </View>
  );
}
