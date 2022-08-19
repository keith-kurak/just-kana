import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ReadingKana from './characters/ReadingKana';

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

function KanaTypingOverlay({ typingKana, onPressKey }) {
  const insets = useSafeAreaInsets();

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
      <View style={{ marginBottom: insets.bottom }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          {typingKana.map((kana, index) => (
            <ReadingKana key={index.toString()} kana={kana} />
          ))}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <KeyboardKey title="<" onPress={() => onPressKey('<')} />
          <KeyboardKey title="_" onPress={() => onPressKey('_')} width={100} />
          <KeyboardKey title="+" onPress={() => onPressKey('+')} />
        </View>
      </View>
    </View>
  );
}

export default KanaTypingOverlay;
