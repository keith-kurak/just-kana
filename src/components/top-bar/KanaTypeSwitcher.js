import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useStyles } from '../../config/styles';

export default function ({ onPressKanaType, kanaType }) {
  const { textStyles, colors, sizes } = useStyles();
  const katakanaInKana = 'カタカナ';
  const hiraganaInKana = 'ひらがな';
  //const katakanaInKana = 'katakana';
  //const hiraganaInKana = 'hiragana';

  const smallTextStyle = {
    color: colors.secondaryTextColor,
    fontSize: 10,
    textAlign: 'center',
  };
  const selectedStyle = { color: colors.buttonColor };
  return (
    <Pressable style={{ justifyContent: 'center' }} onPress={onPressKanaType}>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text
          allowFontScaling={false}
          style={[smallTextStyle, kanaType === 'katakana' ? selectedStyle : {}]}>
          {katakanaInKana}
        </Text>
        <View
          style={{
            height: 1,
            marginVertical: 3,
            alignSelf: 'center',
            backgroundColor: colors.secondaryTextColor,
            width: '60%',
          }}
        />
        <Text
          allowFontScaling={false}
          style={[smallTextStyle, kanaType === 'hiragana' ? selectedStyle : {}]}>
          {hiraganaInKana}
        </Text>
      </View>
    </Pressable>
  );
}
