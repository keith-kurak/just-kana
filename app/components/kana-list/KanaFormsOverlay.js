import React, { useCallback } from 'react';
import { View, Pressable, Text } from 'react-native';
import { groupBy, keys } from 'lodash';
import { colord } from 'colord';
import { useStyles } from '../../config/styles';
import KanaButton from './KanaButton';

function KanaButtonWithRomajiHint({ kana, onPressKana, onRequestHide, color, showConsonants }) {
  const { sizes, colors } = useStyles();

  const onPress = useCallback(() => {
    onPressKana(kana);
    onRequestHide();
  }, [kana, onPressKana, onRequestHide]);

  return (
    <View style={{ marginHorizontal: sizes.kanaButtonSpaceBetween / 2 }}>
      {showConsonants && (
        <Text
          style={{
            fontSize: 16,
            textAlign: 'center',
            paddingBottom: sizes.small,
            color: colors.buttonTextColor,
          }}>
          {kana.romaji}
        </Text>
      )}
      <KanaButton kana={kana} onPress={onPress} color={color} />
    </View>
  );
}

export default function KanaFormOverlay({
  kana,
  onPressKana,
  onRequestHide,
  isVisible = false,
  kanaProvider,
  showConsonants,
}) {
  const { sizes, colors, colorScheme } = useStyles();

  if (!isVisible) {
    return null;
  }

  const allKanaForms = kanaProvider.getAllFormsForKana(kana);

  const kanaFormsGroupedByConsonant = groupBy(allKanaForms, (k) => k.consonant);

  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        alignItems: 'center',
      }}>
      <Pressable style={{ flex: 1, width: '100%' }} onPress={onRequestHide}>
        <View style={{ flex: 1, width: '100%' }}>
          <View
            style={{
              backgroundColor: colors.backgroundColor,
              opacity: 0.9,
              position: 'absolute',
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
            }}
          />
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                borderRadius: sizes.borderRadius,
                backgroundColor: colors.overlayColorSolid,
                minWidth: 150,
              }}>
              {keys(kanaFormsGroupedByConsonant).map((consonant) => (
                <View
                  key={consonant}
                  style={{
                    flexDirection: 'row',
                    paddingTop: sizes.small,
                    paddingBottom: sizes.small,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {kanaFormsGroupedByConsonant[consonant].map((k, index) => (
                    <KanaButtonWithRomajiHint
                      key={k.kana}
                      onRequestHide={onRequestHide}
                      onPressKana={onPressKana}
                      kana={k}
                      color={colord(colors.buttonColor)
                        [colorScheme + 'en'](index === 0 ? 0 : 0.1)
                        .toHex()}
                      showConsonants={showConsonants}
                    />
                  ))}
                </View>
              ))}
            </View>
            <View style={{ height: sizes.small }} />
            <KanaButton text="X" onPress={onRequestHide} color={colors.destructive} />
          </View>
        </View>
      </Pressable>
    </View>
  );
}
