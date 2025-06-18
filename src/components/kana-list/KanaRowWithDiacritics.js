import React from 'react';
import KanaRow from './KanaRow';

function KanaRowWithDiacritics({
  primaryRow,
  primaryConsonant,
  alternateConsonants,
  onPressKana,
  onLongPressKana,
  onFinishLongPressKana,
  color,
  showConsonant,
}) {
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
