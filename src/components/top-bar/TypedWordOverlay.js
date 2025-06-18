import React, { useRef, useEffect } from 'react';
import { ScrollView, View, Pressable } from 'react-native';
import BlinkView from 'react-native-smooth-blink-view';
import ReadingKana from '../characters/ReadingKana';
import { useStyles } from '../../config/styles';

function BlinkingCursor() {
  const { colors, textStyles, sizes } = useStyles();
  return (
    <BlinkView
      delayVisible={300}
      delayInvisible={0}
      duration={500}
      blinking
      containerStyle={{
        width: 26,
        marginHorizontal: 2,
        borderBottomWidth: 2,
        borderBottomColor: colors.buttonTextColor,
        alignSelf: 'flex-end',
      }}
    />
  );
}

export default function TypedWordOverlay({ typingKana, showBlinkingCursor = true }) {
  const { colors, textStyles, sizes } = useStyles();
  const scrollViewRef = useRef();
  const scrollEnabled = typingKana.length > 8;
  useEffect(() => {
    if (scrollViewRef.current && scrollEnabled) {
      setTimeout(() => {
        scrollViewRef.current.scrollToEnd({ animated: false });
      }, 100);
    }
  }, [typingKana, scrollViewRef, scrollEnabled]);

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      scrollEnabled={scrollEnabled}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 1,
        paddingHorizontal: sizes.medium,
      }}>
      {typingKana.map((kana, index) => (
        <ReadingKana key={index.toString()} kana={kana} />
      ))}
      {showBlinkingCursor && <BlinkingCursor />}
    </ScrollView>
  );
}
