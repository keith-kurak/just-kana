import { useState, useCallback } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getKanaTable } from '../kana-utils';
import KanaTypingOverlay from './KanaTypingOverlay';
import { useStyles } from '../config/styles';
import TopStatusBar from './TopStatusBar';

function Kana({ kana, onPress, color }) {
  const { textStyles } = useStyles();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
      <View
        style={{
          height: 50,
          width: 50,
          backgroundColor: color,
          borderRadius: 25,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={textStyles.buttonTextStyle}>{kana.kana}</Text>
      </View>
    </Pressable>
  );
}

function KanaRow({ items, onPressKana, color }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10 }}>
      {items.map((item, index) =>
        item ? (
          <Kana color={color} key={item.kana} kana={item} onPress={() => onPressKana(item)} />
        ) : (
          <View key={index.toString()} style={{ width: 50 }} />
        )
      )}
    </View>
  );
}

function KanaList({ onPressKana, typingKana, onPressKeyboardKey, savedWords, onPressShowWordList }) {
  const { colors } = useStyles();
  const insets = useSafeAreaInsets();
  
  const tableRows = getKanaTable();
  return (
    <View style={{ flex: 1, backgroundColor: colors.backgroundColor }}>
      <ScrollView contentContainerStyle={{ marginTop: insets.top + 50 }}>
        {tableRows.map((row, index) => (
          <KanaRow
            key={index.toString()}
            items={row}
            color={colors.buttonColor}
            onPressKana={onPressKana}
          />
        ))}
        <View style={{ height: 160 + insets.bottom }} />
      </ScrollView>
      <KanaTypingOverlay typingKana={typingKana} onPressKey={onPressKeyboardKey} />
      <TopStatusBar savedWords={savedWords} onPressShowWordList={onPressShowWordList} />
    </View>
  );
}

export default KanaList;
