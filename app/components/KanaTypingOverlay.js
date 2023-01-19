import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useStyles } from '../config/styles';

function KeyboardKeyDisplay({ title }) {
  const { sizes } = useStyles();
  if (title === '+') {
    return <Feather name="plus" size={30} color="white" />;
  }
  if (title === '<') {
    return <Feather name="arrow-left" size={30} color="white" />;
  }
  if (title === '_') {
    return <MaterialIcons name="space-bar" size={30} color="white" />;
  }
  return (
    <Text allowFontScaling={false} style={{ fontSize: 30, color: 'white' }}>
      {title}
    </Text>
  );
}

function KeyboardKey({ title, onPress, width = undefined, enableHoldPress = false }) {
  const { sizes } = useStyles();

  // long press stuff
  const [isHeld, setIsHeld] = useState(false);
  const onLongPress = useCallback(() => {
    if (enableHoldPress) {
      setIsHeld(true);
      console.log('long press');
    }
  }, [enableHoldPress, setIsHeld]);

  const onPressOut = useCallback(() => {
    if (enableHoldPress) {
      setIsHeld(false);
      console.log('press out');
    }
  }, [enableHoldPress, setIsHeld]);

  useEffect(() => {
    function pressIfHeld() {
      if (isHeld) {
        // this onPress is stale.
        // So it never deletes, because it contains the old value of typingKana
        // might need global state for this
        onPress();
        console.log('pressing');
        setTimeout(pressIfHeld, 500);
      }
    }
    if (isHeld) {
      pressIfHeld();
    }
  }, [isHeld, onPress]);

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      onPressOut={onPressOut}
      style={({ pressed }) => [
        { opacity: pressed ? 0.5 : 1, marginHorizontal: sizes.large, marginVertical: sizes.small },
      ]}>
      <View
        style={{
          alignItems: 'center',
          borderWidth: 1,
          borderColor: 'white',
          paddingHorizontal: sizes.small,
          borderRadius: sizes.borderRadius,
          justifyContent: 'center',
          height: 40,
          width,
        }}>
        <KeyboardKeyDisplay title={title} />
      </View>
    </Pressable>
  );
}

function KanaTypingOverlay({ typingKana, onPressKey }) {
  const insets = useSafeAreaInsets();
  const { colors } = useStyles();

  if (!typingKana.length) {
    return null;
  }

  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.overlayColor,
      }}>
      <View style={{ marginBottom: insets.bottom }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <KeyboardKey title="<" onPress={() => onPressKey('<')} />
          <View style={{ flexDirection: 'row' }}>
            <KeyboardKey title="ー" onPress={() => onPressKey('ー')} />
            <KeyboardKey title="_" onPress={() => onPressKey('_')} width={100} />
          </View>
          <KeyboardKey title="+" onPress={() => onPressKey('+')} />
        </View>
      </View>
    </View>
  );
}

export default KanaTypingOverlay;
