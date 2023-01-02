import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useStyles } from '../../config/styles';

export default function Toolbar({
  onChangeSetting,
  showVowels = true,
  onPressShowWordList,
  savedWords,
}) {
  const { textStyles, colors, sizes } = useStyles();
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: sizes.large,
        height: sizes.topBar,
        alignItems: 'center',
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
        }}>
        <Pressable onPress={() => onChangeSetting('showVowelsAndConsonants', !showVowels)}>
          <View
            style={{
              backgroundColor: showVowels ? colors.buttonColor : 'gray',
              paddingVertical: 5,
              paddingHorizontal: 10,
              borderRadius: 5,
              alignItems: 'center',
            }}>
            <Text allowFontScaling={false} style={textStyles.smallDark}>
              aiueo
            </Text>
          </View>
        </Pressable>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          flex: 1,
        }}>
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
              <Text allowFontScaling={false} style={textStyles.smallDark}>
                {savedWords.length}
              </Text>
            </View>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
