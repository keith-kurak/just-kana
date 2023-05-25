import React, { useCallback, useState } from 'react';
import { View, Text, useWindowDimensions, Platform } from 'react-native';
import KanaRow from './KanaRow';
import Carousel from 'react-native-reanimated-carousel';
import { useStyles } from '../../config/styles';

function indexToDakuten(index) {
  switch (index) {
    case 1:
      return '゛';
    case 2:
      return '゜';
    default:
      return '';
  }
}

function DakutenIndicator({ consonants, showConsonant, activeIndex }) {
  const { colors, sizes } = useStyles();

  const wrapDakuten = (symbol, index) => (
    <Text
      key={symbol}
      allowFontScaling={false}
      style={{
        fontSize: showConsonant ? 10 : 20,
        marginLeft: showConsonant ? 0 : 5,
        color: colors.secondaryTextColor,
        textAlign: 'center',
        fontWeight: index === activeIndex ? 'bold' : 'normal',
        marginTop: Platform.OS ==='android' && !showConsonant ? -8 : undefined
      }}>
      {showConsonant ? symbol : indexToDakuten(index)}
    </Text>
  );

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: sizes.verticalKey,
        height: sizes.kanaButtonDiameter
      }}>
      {consonants.map(wrapDakuten)}
    </View>
  );
}

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
  const [activeIndex, setActiveIndex] = useState(0);
  const { width } = useWindowDimensions();
  const { sizes } = useStyles();

  const pressFns = { onPressKana, onLongPressKana, onFinishLongPressKana };

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
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Carousel
        loop={false}
        width={width - sizes.verticalKey}
        height={sizes.kanaButtonDiameter + sizes.small * 2}
        data={kanaRows}
        scrollAnimationDuration={1000}
        panGestureHandlerProps={{
          activeOffsetX: [-10, 10],
        }}
        onSnapToItem={setActiveIndex}
        renderItem={({ index }) => (
          <KanaRow
            items={kanaRows[index]}
            color={color}
            consonant={kanaRowConsonants[index]}
            showConsonant={showConsonant}
            alternateRows={alternateRows}
            alternateConsonants={alternateConsonants}
            {...pressFns}
          />
        )}
      />
      <DakutenIndicator
        activeIndex={activeIndex}
        consonants={kanaRowConsonants}
        showConsonant={showConsonant}
      />
    </View>
  );
}

export default KanaRowSwitcher;
