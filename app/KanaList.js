import { useState } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { getKanaTable } from './kana-utils';

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
      {items.map((item) => (
        item ? <Kana key={item.kana} kana={item} onPress={() => onPressKana(item)} /> : <View style={{ width: 50 }} />
      ))}
    </View>
  );
}

function TypingKana({ kana }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: 30 }}>{kana.kana}</Text>
      <Text>{kana.romaji}</Text>
    </View>
  );
}

function KanaTypingOverlay({ typingKana }) {
  if (!typingKana.length) {
    return null;
  }
  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 80,
        backgroundColor: 'gray',
        opacity: 0.8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {typingKana.map((kana, index) => (
        <TypingKana key={index.toString()} kana={kana} />
      ))}
    </View>
  );
}

function KanaList() {
  const [typingKana, setTypingKana] = useState([]);
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
      <KanaTypingOverlay typingKana={typingKana} />
    </View>
  );
}

export default KanaList;
