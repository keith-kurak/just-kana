import React from 'react';
import WordList from '../components/WordList';
import { useAppState } from '../stores';

export default function () {
  const { savedWords } = useAppState();
  console.log(savedWords);
  return <WordList words={savedWords} />;
}
