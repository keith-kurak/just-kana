import React from 'react';
import WordList from '../components/WordList';
import { useAppState } from '../stores';
import MinimalNavbarWrapper from '../components/MinimalNavbarWrapper';

export default function () {
  const { savedWords } = useAppState();
  console.log(savedWords);
  return (
    <MinimalNavbarWrapper>
      <WordList words={savedWords} />
    </MinimalNavbarWrapper>
  );
}
