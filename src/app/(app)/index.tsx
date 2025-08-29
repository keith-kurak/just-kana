import React, { useState, useCallback } from 'react';
import { View } from 'react-native';
import KanaList from '@/components/kana-list';
import TopBar from '@/components/top-bar';
import KanaFormsOverlay from '@/components/kana-list/KanaFormsOverlay';
import KanaTypingOverlay from '@/components/KanaTypingOverlay';
import { hiraganaProvider, katakanaProvider } from '@/kana-utils';
import { useAppState } from '@/stores';
import { useStyles } from '@/config/styles';
import { useRouter } from 'expo-router';

type TypingKana = { kana: string; romaji: string };

export default function Index() {
  const { savedWords, addWord, settings, setSetting, toggleKanaType, kanaType } = useAppState();
  // a word that is being typed
  const [typingKana, setTypingKana] = useState<TypingKana[]>([]);
  // just peeking at a single letter
  const [longPressKana, setLongPressKana] = useState<TypingKana[]>([]);
  const { colors } = useStyles();

  const router = useRouter();

  const onPressKey = useCallback(
    (key: string) => {
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
      // chōonpu mark
      if (key === 'ー') {
        const newTypingKana = typingKana.slice();
        newTypingKana.push({
          kana: 'ー',
          romaji: '',
        });
        setTypingKana(newTypingKana);
      }

      // sokuonfu mark (katakana)
      if (key === 'ッ') {
        const newTypingKana = typingKana.slice();
        newTypingKana.push({
          kana: 'ッ',
          romaji: '',
        });
        setTypingKana(newTypingKana);
      }

      // sokuonfu mark (hiragana)
      if (key === 'っ') {
        const newTypingKana = typingKana.slice();
        newTypingKana.push({
          kana: 'っ',
          romaji: '',
        });
        setTypingKana(newTypingKana);
      }
    },
    [typingKana, setTypingKana, addWord]
  );

  // typing
  const onPressKana = useCallback(
    (kana: TypingKana) => {
      const newTypingKana = typingKana.slice();
      newTypingKana.push(kana);
      setTypingKana(newTypingKana);
    },
    [typingKana, setTypingKana]
  );

  // long press extra context
  const onLongPressKana = useCallback(
    (kana: TypingKana) => {
      setLongPressKana([kana]);
    },
    [setLongPressKana]
  );

  const onFinishLongPressKana = useCallback(() => {
    if (longPressKana.length) {
      setLongPressKana([]);
    }
  }, [longPressKana, setLongPressKana]);

  const kanaProvider = kanaType === 'katakana' ? katakanaProvider : hiraganaProvider;

  return (
    <View style={{ flex: 1, backgroundColor: colors.backgroundColor }}>
      <KanaList
        onLongPressKana={onLongPressKana}
        onPressKana={onPressKana}
        showConsonants={settings['showVowelsAndConsonants']}
        kanaProvider={kanaProvider}
      />
      <KanaFormsOverlay
        kana={longPressKana && longPressKana[0]}
        onPressKana={onPressKana}
        isVisible={!!longPressKana.length}
        onRequestHide={onFinishLongPressKana}
        showConsonants={settings['showVowelsAndConsonants']}
        kanaProvider={kanaProvider}
      />
      <KanaTypingOverlay kanaType={kanaType} typingKana={typingKana} onPressKey={onPressKey} />
      <TopBar
        showVowels={settings['showVowelsAndConsonants']}
        primaryColorIndex={settings['primaryColorIndex']}
        savedWords={savedWords}
        onPressShowWordList={() => router.navigate('/words')}
        onChangeSetting={setSetting}
        typingKana={typingKana}
        peekingKana={[]}
        onPressKanaType={toggleKanaType}
        kanaType={kanaType}
      />
    </View>
  );
}
