import React, { useState } from 'react';
import WordList from '../components/word-list';
import { useAppState } from '../stores';
import MinimalNavbarWrapper from '../components/MinimalNavbarWrapper';
import WordDetailModal from '../components/WordDetailModal';

export default function () {
  const { savedWords } = useAppState();
  const [selectedWord, setSelectedWord] = useState(null);
  return (
    <MinimalNavbarWrapper>
      <WordList words={savedWords} onPressWord={(word) => setSelectedWord(word)} />
      <WordDetailModal
        word={selectedWord}
        isVisible={!!selectedWord}
        onDismiss={() => setSelectedWord(null)}
      />
    </MinimalNavbarWrapper>
  );
}
