import React from 'react';
import { View, Text } from 'react-native';

function ReadingKana({ kana }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: 30, }}>{kana.kana}</Text>
      <Text>{kana.romaji}</Text>
    </View>
  );
}

export default ReadingKana;