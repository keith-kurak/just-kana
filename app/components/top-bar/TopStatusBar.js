import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStyles } from '../../config/styles';
import Toolbar from './Toolbar';

function Vowel({ text, show }) {
  const { textStyles, colors, sizes } = useStyles();
  return (
    <Text
      allowFontScaling={false}
      style={{
        width: sizes.kanaButtonDiameter,
        fontSize: 16,
        textAlign: 'center',
        paddingBottom: sizes.small,
        color: colors.buttonTextColor,
      }}>
      {show ? text : ''}
    </Text>
  );
}

export default function ({ savedWords, onPressShowWordList, showVowels = true, onChangeSetting }) {
  const { colors, sizes } = useStyles();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        height: sizes.expandedTopBar + insets.top,
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        justifyContent: 'space-between',
      }}>
      <View
        style={{
          backgroundColor: colors.backgroundColor + '99',
          marginTop: insets.top,
        }}>
        <Toolbar
          onChangeSetting={onChangeSetting}
          showVowels={showVowels}
          onPressShowWordList={onPressShowWordList}
          savedWords={savedWords}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: sizes.verticalKey,
          justifyContent: 'space-between',
        }}>
        {showVowels &&
          ['a', 'i', 'u', 'e', 'o'].map((vowel) => (
            <Vowel key={vowel} text={vowel} show={showVowels} />
          ))}
      </View>
    </View>
  );
}
