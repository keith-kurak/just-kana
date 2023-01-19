import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useStyles } from '../../config/styles';
import IconBadge from '../IconBadge';

export default function Toolbar({
  onChangeSetting,
  showVowels = true,
  primaryColorIndex,
  onPressShowWordList,
  savedWords,
}) {
  const { textStyles, colors, sizes, colorOptions } = useStyles();
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
          alignItems: 'center',
        }}>
        <Pressable onPress={() => onChangeSetting('showVowelsAndConsonants', !showVowels)}>
          <View
            style={{
              borderColor: showVowels ? colors.buttonColor : colors.secondaryTextColor,
              paddingHorizontal: 10,
              paddingVertical: 5,
              //backgroundColor: showVowels ? colors.buttonColor : colors.secondaryTextColor,
              /*,
              borderRadius: sizes.borderRadius,
              borderWidth: 2,*/
              alignItems: 'center',
            }}>
            <Text
              allowFontScaling={false}
              style={[
                textStyles.smallDark,
                {
                  fontStyle: 'italic',
                  fontSize: 26,
                  color: showVowels ? colors.buttonColor : colors.secondaryTextColor,
                },
              ]}>
              aiueo
            </Text>
          </View>
        </Pressable>
        <Pressable
          style={{ marginLeft: 8 }}
          onPress={() => onChangeSetting('primaryColorIndex', primaryColorIndex + 1 )}>
          <View
            style={{
              borderColor: colors.buttonTextColor,
              borderWidth: 2,
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: colors.buttonColor,
              alignItems: 'center',
            }}
          />
        </Pressable>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          flex: 1,
        }}>
        {savedWords.length ? (
          <IconBadge badgeCount={savedWords.length} color={colors.buttonColor} size={sizes.topBar}>
            <Pressable onPress={onPressShowWordList}>
              <View
                style={{
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderRadius: sizes.borderRadius,
                  borderWidth: 2,
                  borderColor: colors.buttonTextColor,
                  alignItems: 'center',
                }}>
                <Text allowFontScaling={false} style={textStyles.smallDark}>
                  {`カナ`}
                </Text>
              </View>
            </Pressable>
          </IconBadge>
        ) : null}
      </View>
    </View>
  );
}
