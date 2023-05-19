import React, { useCallback, useState } from 'react';
import { View, Text, Platform, Pressable } from 'react-native';
import KanaRow from './KanaRow';
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

function ExpanderButton({ alternateConsonants, showConsonant, isExpanded, onPress }) {
  const { colors } = useStyles();

  return <Pressable onPress={onPress}>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {isExpanded ?
        <DakutenIndicator
          consonants={alternateConsonants}
          showConsonant={showConsonant}
        /> : <Text style={{ color: colors.secondaryTextColor, fontSize: 20 }}>-</Text>}
    </View>
  </Pressable>
}

function DakutenIndicator({ consonants, showConsonant }) {
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
        marginTop: Platform.OS === 'android' && !showConsonant ? -8 : undefined
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

function KanaRowWithDiacritics({
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
  const [isExpanded, setIsExpanded] = useState(false);

  const onPressExpander = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded, setIsExpanded]);

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

  return (
    <View>
      <KanaRow
        items={primaryRow}
        color={color}
        consonant={primaryConsonant}
        showConsonant={showConsonant}
        {...pressFns}
      />
      {isExpanded && alternateRows.map((row, index) => (
        <KanaRow
          items={row}
          color={color}
          consonant={alternateConsonants[index]}
          showConsonant={showConsonant}
          alternateRows={alternateRows}
          alternateConsonants={alternateConsonants}
          {...pressFns}
        />
      ))}
      <ExpanderButton isExpanded={isExpanded}
        onPress={onPressExpander} showConsonant={showConsonant} alternateConsonants={alternateConsonants} />
    </View>
  )
}

export default KanaRowWithDiacritics;
