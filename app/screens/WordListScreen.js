import React, { useState } from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WordList from '../components/word-list';
import { useAppState } from '../stores';
import MinimalNavbarWrapper from '../components/MinimalNavbarWrapper';
import WordDetailModal from '../components/WordDetailModal';
import SegmentedControl from '../components/SegmentedControl';
import { useStyles } from '../config/styles';
import { commonWords } from '../kana-utils';

export default function ({ navigation }) {
  const { savedWords, deleteWord } = useAppState();
  const [selectedWord, setSelectedWord] = useState(null);
  const [filterIndex, setFilterIndex] = useState(0);
  const { colors } = useStyles();

  const myWordList = filterIndex === 0 ? savedWords : commonWords;

  return (
    <MinimalNavbarWrapper
      rightButton={
        <Pressable onPress={() => navigation.navigate('Settings')}>
          <Ionicons color={colors.buttonTextColor} size={30} name="settings-outline" />
        </Pressable>
      }
      center={
        <SegmentedControl
          selectedIndex={filterIndex}
          onChange={(index) => setFilterIndex(index)}
          options={['Mine', 'Common']}
        />
      }>
      <WordList
        words={myWordList}
        onPressWord={(word) => setSelectedWord(word)}
        grouping={filterIndex === 0 ? 'date' : 'default'}
      />
      <WordDetailModal
        word={selectedWord}
        isVisible={!!selectedWord}
        onDismiss={() => setSelectedWord(null)}
        canDelete={filterIndex === 0}
        onPressDelete={() => {
          deleteWord(selectedWord);
          setSelectedWord(null);
        }}
      />
    </MinimalNavbarWrapper>
  );
}
