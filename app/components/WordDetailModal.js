import React from 'react';
import Modal from 'react-native-modal';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';
import * as Clipboard from 'expo-clipboard';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import ReadingKana from './characters/ReadingKana';
import { useStyles } from '../config/styles';

function ToolbarButton({ onPress, IconComponent, iconName, color = 'white' }) {
  const { colors, sizes } = useStyles();
  const iconProps = { size: 30, color };
  return (
    <Pressable
      style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1, marginHorizontal: sizes.medium }]}
      onPress={onPress}>
      <View
        style={{
          alignItems: 'center',
          borderWidth: 1,
          borderColor: color,
          paddingHorizontal: sizes.small,
          borderRadius: sizes.borderRadius,
          justifyContent: 'center',
          height: 50,
          width: 60,
        }}>
        <IconComponent name={iconName} {...iconProps} />
      </View>
    </Pressable>
  );
}

export default function ({ isVisible, word, onDismiss }) {
  const { colors, colorOptions, sizes } = useStyles();
  const { bottom } = useSafeAreaInsets();

  const speak = () => {
    const thingToSay = word.word.map((kana) => kana.romaji).join('');
    Speech.speak(thingToSay, { language: 'ja' });
  };

  const copy = () => {
    const thingToCopy =word.word.map((kana) => kana.kana).join('') + ' -> ' + word.word.map((kana) => kana.romaji).join('');
    Clipboard.setStringAsync(thingToCopy);
  }

  return (
    <Modal
      style={{ margin: 0, padding: 0 }}
      backdropColor={colors.backgroundColor}
      onSwipeComplete={onDismiss}
      onBackdropPress={onDismiss}
      isVisible={isVisible}>
      <View
        style={{
          backgroundColor: colors.overlayColor,
          position: 'absolute',
          right: 0,
          bottom: 0,
          left: 0,
          paddingBottom: bottom + sizes.medium,
          paddingTop: sizes.medium,
          paddingHorizontal: sizes.medium,
        }}>
        <View
          style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: sizes.medium }}>
          <ToolbarButton
            onPress={speak}
            IconComponent={Ionicons}
            iconName="chatbubble-ellipses-outline"
          />
          <ToolbarButton
            onPress={() => {}}
            IconComponent={MaterialIcons}
            iconName="translate"
          />
          <ToolbarButton
            onPress={copy}
            IconComponent={Ionicons}
            iconName="ios-copy-outline"
          />
          <ToolbarButton
            color={colors.destructive}
            onPress={() => {}}
            IconComponent={MaterialIcons}
            iconName="delete-outline"
          />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
          {word &&
            word.word.map((kana, index) => <ReadingKana key={index.toString()} kana={kana} />)}
        </View>
      </View>
    </Modal>
  );
}
