import React from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import KanaRow from './KanaRow';
import Carousel from 'react-native-reanimated-carousel';
import { useStyles } from '../../config/styles';

function KanaRowSwitcher({
  primaryRow,
  primaryConsonant,
  alternateRows,
  alternateConsonants,
  onPressKana,
  color,
  showConsonant,
}) {
  const { width } = useWindowDimensions();
  const { sizes } = useStyles();

  // now carousel if no alternate rows
  if (!alternateRows.length) {
    return (
      <KanaRow
        items={primaryRow}
        color={color}
        onPressKana={onPressKana}
        consonant={primaryConsonant}
        showConsonant={showConsonant}
      />
    );
  }

  // show carousel for alternate rows
  const kanaRows = [primaryRow, ...alternateRows];
  const kanaRowConsonants = [primaryConsonant, ...alternateConsonants];
  return (
    <Carousel
      loop={false}
      width={width}
      height={sizes.kanaButtonDiameter + sizes.small * 2}
      data={kanaRows}
      scrollAnimationDuration={1000}
      renderItem={({ index }) => (
        <KanaRow
          items={kanaRows[index]}
          color={color}
          onPressKana={onPressKana}
          consonant={kanaRowConsonants[index]}
          showConsonant={showConsonant}
          alternateRowCount={alternateRows.length}
        />
      )}
    />
  );
}

export default KanaRowSwitcher;
