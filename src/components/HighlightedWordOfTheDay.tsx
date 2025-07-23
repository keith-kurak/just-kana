import { useEffect, useState } from 'react';
import { View, Text, Pressable, AppState, Alert } from 'react-native';
import { useStyles } from '@/config/styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { commonWords } from '../kana-utils';
import ReadingKana from './characters/ReadingKana';

export default function HighlightedWordOfTheDay() {
  const { sizes, colors, textStyles } = useStyles();

  const wordsOfTheDay = commonWords.filter((group: any) => group.title === 'Words of the Day');
  console.log(wordsOfTheDay[0].data);
  const highlightedWordOfTheDay = wordsOfTheDay[0].data.find((word: any) => word.highlight);

  const [visible, setVisible] = useState(!!highlightedWordOfTheDay);

  if (!visible) return null;

  if (visible) {
    return (
      <View
        style={[
          {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}>
        <View
          style={{
            borderRadius: sizes.borderRadius,
            padding: sizes.medium,
            backgroundColor: colors.overlayColorSolid,
            width: '80%',
            height: 200,
          }}>
          <View
            style={{
              flex: 1,
              paddingRight: sizes.medium,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={[textStyles.smallDark, { fontWeight: 'bold', marginBottom: sizes.medium }]}>
              Check out the word of the day
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {highlightedWordOfTheDay.word.map((kana, index) => (
                <ReadingKana key={index.toString()} kana={kana} />
              ))}
            </View>
            {highlightedWordOfTheDay.translation && (
              <View style={{ marginTop: sizes.small, alignSelf: 'center' }}>
                <Text
                  style={[
                    textStyles.smallLight,
                    { fontStyle: 'italic' },
                  ]}>{`"${highlightedWordOfTheDay.translation}"`}</Text>
              </View>
            )}
            <Pressable onPress={() => setVisible(false)}>
              <Text
                style={{
                  color: colors.buttonTextColor,
                  borderWidth: 1,
                  borderColor: colors.buttonTextColor,
                  padding: sizes.small,
                  borderRadius: sizes.borderRadius,
                  marginVertical: sizes.medium,
                }}>
                Cool
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }
}
