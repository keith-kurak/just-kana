import React from 'react';
import WordList from '../components/word-list';
import { useAppState } from '../stores';
import MinimalNavbarWrapper from '../components/MinimalNavbarWrapper';

export default function () {
  const { savedWords } = useAppState();
  return (
    <MinimalNavbarWrapper>
      <WordList words={savedWords} />
    </MinimalNavbarWrapper>
  );
}
