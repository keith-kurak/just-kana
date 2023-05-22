import React, { useCallback } from 'react';
import { View, Pressable, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { hiraganaProvider, katakanaProvider } from '../../kana-utils';
import { useStyles } from '../../config/styles';
import KanaButton from './KanaButton';

function KanaButtonWithRomajiHint({ kana, onPressKana, onRequestHide, color }) {
  const { sizes, colors } = useStyles();

  const onPress = useCallback(() => {
    onPressKana(kana);
    onRequestHide();
  }, [kana, onPressKana, onRequestHide]);

  return (
    <View>
      <Text
        style={{
          fontSize: 16,
          textAlign: 'center',
          paddingBottom: sizes.small,
          color: colors.buttonTextColor,
        }}>
        {kana.romaji}
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
      <BlurView style={{ flex: 1, width: '100%' }} intensity={40}>
        <View
          style={{
            marginTop: sizes.expandedTopBar + verticalOffset,
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: colors.overlayColor,
              borderRadius: sizes.borderRadius,
              paddingTop: sizes.small,
              paddingBottom: sizes.small,
              minWidth: 100,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <KanaButtonWithRomajiHint
              onRequestHide={onRequestHide}
              onPressKana={onPressKana}
              kana={kana}
              color={colors.buttonColor}
            />
          </View>
          <View style={{ height: sizes.small }} />
          <KanaButton text="X" onPress={onRequestHide} color={colors.destructive} />
        </View>
      </BlurView>
    </View>
  );
}
