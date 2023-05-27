import React, { useCallback } from 'react';
import { View, Pressable, Text } from 'react-native';
import { BlurView } from 'expo-blur';
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
      <Text
        style={{
          fontSize: 16,
          textAlign: 'center',
          paddingBottom: sizes.small,
          color: colors.buttonTextColor,
        }}>
        {showConsonants && kana.romaji}
      </Text>
      <KanaButton kana={kana} onPress={onPress} color={color} />
    </View>
  );
}

export default function KanaFormOverlay({
  kana,
  verticalOffset = 235,
  onPressKana,
  onRequestHide,
  isVisible = false,
  kanaProvider,
  showConsonants,
}) {
  const { sizes, colors } = useStyles();

  if (!isVisible) {
    return null;
  }

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
            marginTop: sizes.expandedTopBar + verticalOffset,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              borderRadius: sizes.borderRadius,
              backgroundColor: colors.overlayColorSolid,
              paddingTop: sizes.small,
              paddingBottom: sizes.small,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {kanaProvider.getAllFormsForKana(kana).map((k) => (
              <KanaButtonWithRomajiHint
                key={k.kana}
                onRequestHide={onRequestHide}
                onPressKana={onPressKana}
                kana={k}
                color={colors.buttonColor}
                showConsonants={showConsonants}
              />
            ))}
          </View>
          <View style={{ height: sizes.small }} />
          <KanaButton text="X" onPress={onRequestHide} color={colors.destructive} />
        </View>
      </View>
    </View>
  );
}
