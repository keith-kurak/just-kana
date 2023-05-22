import { View, Text, Pressable, Platform } from 'react-native';
import { useStyles } from '../../config/styles';

export default function KanaButton({
  kana,
  text,
  icon,
  onPress,
  onLongPress,
  onPressOut,
  color,
  showConsonant,
}) {
  const { textStyles, sizes, colors } = useStyles();
  const button = (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      onPressOut={onPressOut}
      style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
      <View
        style={{
          height: sizes.kanaButtonDiameter,
          width: sizes.kanaButtonDiameter,
          backgroundColor: color,
          borderRadius: sizes.kanaButtonDiameter / 2,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Text
            allowFontScaling={false}
            style={[
              textStyles.buttonTextStyle,
              Platform.OS === 'android' && {
                marginBottom: 4 /* Kana are aligned towards bottom on Expo 48; no idea why */,
              },
            ]}>
            {text || kana.kana}
          </Text>
      </View>
    </Pressable>
  );

  if (kana && (kana.kana === 'ン' || kana.kana === 'ん') && showConsonant) {
    return (
      <View>
        {button}
        <Text
          style={{
            fontSize: 16,
            textAlign: 'center',
            paddingTop: sizes.small,
            color: colors.secondaryTextColor,
          }}>
          (n)
        </Text>
      </View>
    );
  }

  return button;
}
