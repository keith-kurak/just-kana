import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useStyles } from '../../config/styles';

export default function ({ onPressKanaType, kanaType }) {
  const { textStyles, colors, sizes } = useStyles();
  return (
    <Pressable onPress={onPressKanaType}>
      <View>
        <Text style={{ color: colors.buttonTextColor }}>{kanaType}</Text>
      </View>
    </Pressable>
  );
}
