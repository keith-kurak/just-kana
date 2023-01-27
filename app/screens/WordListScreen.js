import React, { useState } from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WordList from '../components/word-list';
import { useAppState } from '../stores';
import MinimalNavbarWrapper from '../components/MinimalNavbarWrapper';
import WordDetailModal from '../components/WordDetailModal';
import { useStyles } from '../config/styles';

export default function ({ navigation }) {
  const { savedWords, deleteWord } = useAppState();
  const [selectedWord, setSelectedWord] = useState(null);
  const { colors } = useStyles();
  return (
    <MinimalNavbarWrapper
      rightButton={
        <Pressable onPress={() => navigation.navigate('Settings')}>
          <Ionicons color={colors.buttonTextColor} size="30" name="settings-outline" />
        </Pressable>
      }>
      <WordList words={savedWords} onPressWord={(word) => setSelectedWord(word)} />
      <WordDetailModal
        word={selectedWord}
        isVisible={!!selectedWord}
        onDismiss={() => setSelectedWord(null)}
        onPressDelete={() => {
          deleteWord(selectedWord);
          setSelectedWord(null);
        }}
      />
    </MinimalNavbarWrapper>
  );
}
