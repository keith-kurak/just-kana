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
  onLongPressKana,
  onFinishLongPressKana,
  color,
  showConsonant,
}) {
  const { width } = useWindowDimensions();
  const { sizes } = useStyles();

  const pressFns = { onPressKana, onLongPressKana, onFinishLongPressKana};

  // now carousel if no alternate rows
  if (!alternateRows.length) {
    return (
      <KanaRow
        items={primaryRow}
        color={color}
        consonant={primaryConsonant}
        showConsonant={showConsonant}
        {...pressFns}
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
      panGestureHandlerProps={{
        activeOffsetX: [-10, 10],
      }}
      renderItem={({ index }) => (
        <KanaRow
          items={kanaRows[index]}
          color={color}
          consonant={kanaRowConsonants[index]}
          showConsonant={showConsonant}
          alternateRowCount={alternateRows.length}
          {...pressFns}
        />
      )}
    />
  );
}

export default KanaRowSwitcher;
