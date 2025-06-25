import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStyles } from '../../config/styles';
import Toolbar from './Toolbar';
import TypedWordOverlay from './TypedWordOverlay';

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
        color: colors.secondaryTextColor,
      }}>
      {show ? text : ''}
    </Text>
  );
}

export default function ({
  savedWords,
  onPressShowWordList,
  showVowels = true,
  primaryColorIndex,
  onChangeSetting,
  typingKana,
  peekingKana,
  onPressKanaType,
  kanaType,
}) {
  const { colors, sizes } = useStyles();
  const insets = useSafeAreaInsets();

  const showWordOverlay = peekingKana.length || typingKana.length;

  return (
    <View
      style={{
        height: sizes.expandedTopBar + insets.top,
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        justifyContent: 'space-between',
        backgroundColor: showWordOverlay ? colors.overlayColor : colors.backgroundColor + '99',
      }}>
      <View
        style={{
          marginTop: insets.top,
        }}>
        {showWordOverlay ? (
          <TypedWordOverlay
            showBlinkingCursor={!!typingKana.length}
            typingKana={typingKana.length ? typingKana : peekingKana}
          />
        ) : (
          <Toolbar
            onChangeSetting={onChangeSetting}
            showVowels={showVowels}
            onPressShowWordList={onPressShowWordList}
            savedWords={savedWords}
            primaryColorIndex={primaryColorIndex}
            onPressKanaType={onPressKanaType}
            kanaType={kanaType}
          />
        )}
      </View>
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: sizes.verticalKey,
          justifyContent: 'space-between',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        }}>
        {showVowels &&
          ['a', 'i', 'u', 'e', 'o'].map((vowel) => (
            <Vowel key={vowel} text={vowel} show={showVowels} />
          ))}
      </View>
    </View>
  );
}