import React from 'react';
import KanaRow from './KanaRow';

type TypingKana = { kana: string; romaji: string };

interface KanaRowWithDiacriticsProps {
  onPressKana: (kana: TypingKana) => void;
  showConsonant: boolean;
  onLongPressKana: (kana: TypingKana) => void;
  onFinishLongPressKana?: (kana: TypingKana) => void;
  primaryConsonant: any;
  alternateConsonants: any;
  color: any;
  primaryRow: any;
}


function KanaRowWithDiacritics({
  primaryRow,
  primaryConsonant,
  alternateConsonants,
  onPressKana,
  onLongPressKana,
  onFinishLongPressKana,
  color,
  showConsonant,
}: KanaRowWithDiacriticsProps) {
  const pressFns = { onPressKana, onLongPressKana, onFinishLongPressKana };

  return (
    <KanaRow
      items={primaryRow}
      color={color}
      consonant={primaryConsonant}
      showConsonant={showConsonant}
      alternateConsonants={alternateConsonants}
      {...pressFns}
    />
  );
}

export default KanaRowWithDiacritics;
