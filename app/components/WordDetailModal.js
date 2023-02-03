import React, { useState } from 'react';
import Modal from 'react-native-modal';
import { View, Platform, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';
import * as Clipboard from 'expo-clipboard';
import * as WebBrowser from 'expo-web-browser';
import { WebView } from 'react-native-webview';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import ReadingKana from './characters/ReadingKana';
import { useStyles } from '../config/styles';

const demoProps = {
  animationInTiming: 1,
      animationOutTiming: 1
}

function TranslatorMiniBrowser({ word }) {
  const kanaString = word.word.map((kana) => (kana.kana === ' ' ? '%20' : kana.kana)).join('');
  const { sizes } = useStyles();
  console.log(kanaString);
  return (
    <View style={{ height: 400, width: '100%', marginBottom: sizes.medium }}>
      <WebView
        source={{
          uri: encodeURI(
            `https://translate.google.com/#view=home&op=translate&sl=ja&tl=en&text=${kanaString}`
          ),
        }}
      />
    </View>
  );
}

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

export default function ({ isVisible, word, onDismiss, onPressDelete }) {
  const { colors, colorOptions, sizes } = useStyles();
  const { bottom } = useSafeAreaInsets();
  //const [isTranslateBrowserVisible, setIsTranslateBrowserVisible] = useState(false);

  const speak = () => {
    const thingToSay = word.word.map((kana) => kana.romaji).join('');
    Speech.speak(thingToSay, { language: 'ja' });
  };

  const copy = () => {
    const thingToCopy =
      word.word.map((kana) => kana.kana).join('') +
      ' (' +
      word.word.map((kana) => kana.romaji).join('') +
      ')';
    Clipboard.setStringAsync(thingToCopy);
  };

  const onPressShowTranslation = () => {
    // android is mad about %20 as a space
    const kanaString = word.word.map((kana) => (kana.kana === ' ' ? ' ' : kana.kana)).join('');
    // seems to be needed to make it work right in Google Translate app
    const translationLanguage = Platform.OS === 'android' ? 'en' : 'auto';
    WebBrowser.openBrowserAsync(
      encodeURI(
        `https://translate.google.com/?sl=ja&tl=${translationLanguage}&op=translate&text=${kanaString}`, { createTask: false }
      ),
      {
        createTask: false,
      }
    );
    //setIsTranslateBrowserVisible(!isTranslateBrowserVisible);
  };

  return (
    <Modal
      style={{ margin: 0, padding: 0 }}
      backdropColor={colors.backgroundColor}
      onSwipeComplete={onDismiss}
      onBackdropPress={onDismiss}
      {...demoProps}
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
            onPress={onPressShowTranslation}
            IconComponent={MaterialIcons}
            iconName="translate"
          />
          <ToolbarButton onPress={copy} IconComponent={Ionicons} iconName="ios-copy-outline" />
          <ToolbarButton
            color={colors.destructive}
            onPress={onPressDelete}
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
