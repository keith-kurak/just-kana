import { useState, useCallback } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getKanaTable } from '../kana-utils';
import KanaTypingOverlay from './KanaTypingOverlay';
import { useStyles } from '../config/styles';
import TopStatusBar from './TopStatusBar';

function Kana({ kana, onPress, color }) {
  const { textStyles, sizes } = useStyles();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
      <View
        style={{
          height: sizes.kanaButtonDiameter,
          width: sizes.kanaButtonDiameter,
          backgroundColor: color,
          borderRadius: sizes.kanaButtonDiameter / 2,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={textStyles.buttonTextStyle}>{kana.kana}</Text>
      </View>
    </Pressable>
  );
}

function KanaRow({ items, onPressKana, color }) {
  const { sizes } = useStyles();
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: sizes.small,
        paddingHorizontal: sizes.large,
      }}>
      {items.map((item, index) =>
        item ? (
          <Kana color={color} key={item.kana} kana={item} onPress={() => onPressKana(item)} />
        ) : (
          <View key={index.toString()} style={{ width: sizes.kanaButtonDiameter }} />
        )
      )}
    </View>
  );
}

function KanaList({
  onPressKana,
  typingKana,
  onPressKeyboardKey,
  savedWords,
  onPressShowWordList,
}) {
  const { colors, sizes } = useStyles();
  const insets = useSafeAreaInsets();

  const tableRows = getKanaTable();
  return (
    <View style={{ flex: 1, backgroundColor: colors.backgroundColor }}>
      <ScrollView contentContainerStyle={{ marginTop: insets.top + sizes.topBar }}>
        {tableRows.map((row, index) => (
          <KanaRow
            key={index.toString()}
            items={row}
            color={colors.buttonColor}
            onPressKana={onPressKana}
          />
        ))}
        <View style={{ height: 240 + insets.bottom }} />
      </ScrollView>
      <KanaTypingOverlay typingKana={typingKana} onPressKey={onPressKeyboardKey} />
      <TopStatusBar showVowels={true} savedWords={savedWords} onPressShowWordList={onPressShowWordList} />
    </View>
  );
}

export default KanaList;
