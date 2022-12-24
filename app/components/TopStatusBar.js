import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useStyles } from '../config/styles';

export default function ({ savedWords, onPressShowWordList }) {
  const { textStyles, colors } = useStyles();

  return (
    <View
      style={{
        height: 50,
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
      }}>
      <View
        style={{
          backgroundColor: colors.backgroundColor,
          opacity: 0.5,
          flex: 1,
        }} />
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 40,
          top: 0,
          bottom: 0,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
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
    </View>
  );
}
