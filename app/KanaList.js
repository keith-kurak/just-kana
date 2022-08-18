import { useState, useCallback } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getKanaTable } from './kana-utils';
import KanaTypingOverlay from './components/KanaTypingOverlay';
import { useStyles } from './config/styles';
import TopStatusBar from './components/TopStatusBar';

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

function KanaList() {
  const { colors } = useStyles();
  const [typingKana, setTypingKana] = useState([]);
  const [savedWords, setSavedWords] = useState([]);

  const onPressKey = useCallback((key) => {
    if (key === '<') {
      if (typingKana.length === 1) {
        setTypingKana([]);
      } else {
        setTypingKana(typingKana.slice(0, typingKana.length - 1));
      }
    }
    if (key === '_') {
      const newTypingKana = typingKana.slice();
      newTypingKana.push({
        kana: ' ',
        romaji: ' ',
      });
      setTypingKana(newTypingKana);
    }
    if (key === '+') {
      const newSavedWords = savedWords.slice();
      newSavedWords.push(typingKana);
      setSavedWords(newSavedWords);
      setTypingKana([]);
    }
  });
  const tableRows = getKanaTable();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.backgroundColor }}>
      <ScrollView>
        <TopStatusBar savedWords={savedWords} />
        {tableRows.map((row, index) => (
          <KanaRow
            key={index.toString()}
            items={row}
            color={colors.buttonColor}
            onPressKana={(kana) => {
              const newTypingKana = typingKana.slice();
              newTypingKana.push(kana);
              setTypingKana(newTypingKana);
            }}
          />
        ))}
        <View style={{ height: 130 }} />
      </ScrollView>
      <KanaTypingOverlay typingKana={typingKana} onPressKey={onPressKey} />
    </SafeAreaView>
  );
}

export default KanaList;
