import React from 'react';
import { View, Text, Pressable } from 'react-native';

function KeyboardKey({ title, onPress, width = undefined }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        { opacity: pressed ? 0.5 : 1, marginHorizontal: 10, marginVertical: 5 },
      ]}>
      <View style={{ alignItems: 'center', borderWidth: 1, borderColor: 'white', padding: 5, width }}>
        <Text style={{ fontSize: 30, color: 'white' }}>{title}</Text>
      </View>
    </Pressable>
  );
}

function TypingKana({ kana }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: 30, }}>{kana.kana}</Text>
      <Text>{kana.romaji}</Text>
    </View>
  );
}

function KanaTypingOverlay({ typingKana, onPressKey }) {
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
        backgroundColor: 'gray',
        opacity: 0.8,
      }}>
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          {typingKana.map((kana, index) => (
            <TypingKana key={index.toString()} kana={kana} />
          ))}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <KeyboardKey title="<" onPress={() => onPressKey('<')} />
          <KeyboardKey title="_" onPress={() => onPressKey('_')} width={100} />
        </View>
      </View>
    </View>
  );
}

export default KanaTypingOverlay;
