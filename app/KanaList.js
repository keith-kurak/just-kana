import { useState, useCallback } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { getKanaTable } from './kana-utils';
import KanaTypingOverlay from './components/KanaTypingOverlay';

function Kana({ kana, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
      <View
        style={{
          height: 50,
          width: 50,
          backgroundColor: 'pink',
          borderRadius: 25,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{ color: 'white', fontSize: 30 }}>{kana.kana}</Text>
      </View>
    </Pressable>
  );
}

function KanaRow({ items, onPressKana }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10 }}>
      {items.map((item, index) =>
        item ? (
          <Kana key={item.kana} kana={item} onPress={() => onPressKana(item)} />
        ) : (
          <View key={index.toString()} style={{ width: 50 }} />
        )
      )}
    </View>
  );
}

function KanaList() {
  const [typingKana, setTypingKana] = useState([]);

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
  });
  const tableRows = getKanaTable();
  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        {tableRows.map((row, index) => (
          <KanaRow
            key={index.toString()}
            items={row}
            onPressKana={(kana) => {
              const newTypingKana = typingKana.slice();
              newTypingKana.push(kana);
              setTypingKana(newTypingKana);
            }}
          />
        ))}
      </ScrollView>
      <KanaTypingOverlay typingKana={typingKana} onPressKey={onPressKey} />
    </View>
  );
}

export default KanaList;
