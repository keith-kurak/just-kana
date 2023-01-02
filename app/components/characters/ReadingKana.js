import React from 'react';
import { View, Text } from 'react-native';
import { useStyles } from '../../config/styles';

function ReadingKana({ kana, useDarkText = false }) {
  const { colors, textStyles } = useStyles();
  if (kana.kana === ' ') {
    return <View style={{ width: 30 }} />;
  }
  return (
    <View style={{ alignItems: 'center', width: 30 }}>
      <Text
        allowFontScaling={false}
        style={[
          textStyles.buttonTextStyle,
          { color: useDarkText ? 'black' : colors.buttonTextColor },
        ]}>
        {kana.kana}
      </Text>
      <Text
        allowFontScaling={false}
        style={[textStyles.smallDark, { color: useDarkText ? 'black' : colors.buttonTextColor }]}>
        {kana.romaji}
      </Text>
    </View>
  );
}

export default ReadingKana;
