import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStyles } from '../config/styles';

function Vowel({ text }) {
  const { textStyles, colors, sizes } = useStyles();
  return <Text style={{ width: sizes.kanaButtonDiameter, textAlign: 'center' }}>{text}</Text>;
}

export default function ({ savedWords, onPressShowWordList, showVowels }) {
  const { textStyles, colors, sizes } = useStyles();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        //height: sizes.topBar + insets.top,
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
      }}>
      <View
        style={{
          backgroundColor: colors.backgroundColor + '99',
          paddingTop: insets.top,
          paddingHorizontal: sizes.large,
        }}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          {savedWords.length ? (
            <Pressable onPress={onPressShowWordList}>
              <View
                style={{
                  backgroundColor: 'red',
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderRadius: 5,
                  alignItems: 'center',
                }}>
                <Text style={textStyles.smallDark}>{savedWords.length}</Text>
              </View>
            </Pressable>
          ) : null}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {showVowels &&
            ['a', 'i', 'u', 'e', 'o'].map((vowel) => <Vowel key={vowel} text={vowel} />)}
        </View>
      </View>
    </View>
  );
}
