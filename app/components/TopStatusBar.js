import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStyles } from '../config/styles';

function Vowel({ text, show }) {
  const { textStyles, colors, sizes } = useStyles();
  return (
    <Text
      style={{
        width: sizes.kanaButtonDiameter,
        fontSize: 16,
        textAlign: 'center',
        paddingVertical: sizes.small,
        color: colors.buttonTextColor,
      }}>
      {show ? text : ''}
    </Text>
  );
}

export default function ({
  savedWords,
  onPressShowWordList,
  showVowels = true,
  onChangeSetting,
}) {
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
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: sizes.large,
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
                  <Text style={textStyles.smallDark}>aiueo</Text>
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
                  <Text style={textStyles.smallDark}>{savedWords.length}</Text>
                </View>
              </Pressable>
            ) : null}
          </View>
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
    </View>
  );
}
