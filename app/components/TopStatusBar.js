import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useStyles } from '../config/styles';

export default function ({ savedWords, onPressShowWordList }) {
  const { textStyles } = useStyles();

  return (
    <View
      style={{
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginHorizontal: 20,
      }}>
      {savedWords.length ? (
        <Pressable onPress={onPressShowWordList}>
          <View
            style={{
              backgroundColor: 'red',
              paddingVertical: 5,
              paddingHorizontal: 10,
              borderRadius: 5,
            }}>
            <Text style={textStyles.smallDark}>{savedWords.length}</Text>
          </View>
        </Pressable>
      ) : null}
    </View>
  );
}
