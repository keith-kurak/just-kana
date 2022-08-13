import { useState, useCallback } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { getKanaTable } from './kana-utils';
import KanaTypingOverlay from './components/KanaTypingOverlay';
import { LightenDarkenColor } from 'lighten-darken-color';

function Kana({ kana, onPress, color }) {
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
        <Text style={{ color: 'white', fontSize: 30 }}>{kana.kana}</Text>
      </View>
    </Pressable>
  );
}

function KanaRow({ items, onPressKana, color }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10 }}>
      {items.map((item, index) =>
        item ? (
          <Kana color={LightenDarkenColor(color, 0 + 60 * (index / items.length ))} key={item.kana} kana={item} onPress={() => onPressKana(item)} />
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
            color={LightenDarkenColor('#0000FF', 50 + 80 * (index / tableRows.length))}
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
