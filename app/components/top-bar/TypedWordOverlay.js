import React from 'react';
import { View, Text, Pressable } from 'react-native';
import ReadingKana from '../characters/ReadingKana';
import { useStyles } from '../../config/styles';

export default function TypedWordOverlay({ typingKana }) {
  const { colors, textStyles } = useStyles();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
      {typingKana.map((kana, index) => (
        <ReadingKana key={index.toString()} kana={kana} />
      ))}
    </View>
  );
}
