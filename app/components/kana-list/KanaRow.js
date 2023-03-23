import { View, Text, Pressable, Platform } from 'react-native';
import { useStyles } from '../../config/styles';

function Consonant({ text, show }) {
  const { textStyles, colors, sizes } = useStyles();
  const myText = !show || text.startsWith('~') ? ' ' : text;
  return (
    <Text
      allowFontScaling={false}
      style={{
        width: sizes.verticalKey,
        fontSize: 16,
        textAlign: 'center',
        color: colors.secondaryTextColor,
        alignSelf: 'center',
      }}>
      {myText}
    </Text>
  );
}

function Kana({ kana, onPress, onLongPress, onPressOut, color, showConsonant }) {
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
          {kana.kana}
        </Text>
      </View>
    </Pressable>
  );

  if ((kana.kana === 'ン' || kana.kana === 'ん') && showConsonant) {
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

function KanaRow({
  items,
  onPressKana,
  onLongPressKana,
  onFinishLongPressKana,
  color,
  consonant,
  showConsonant,
  alternateRows = [],
  alternateConsonants = [],
}) {
  const { sizes } = useStyles();
  return (
    <View style={{ flexDirection: 'row' }}>
      <Consonant text={consonant} show={showConsonant} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingVertical: sizes.small,
          //paddingRight: sizes.verticalKey,
          flex: 1,
        }}>
        {items.map((item, index) =>
          item ? (
            <Kana
              color={color}
              key={item.kana}
              kana={item}
              onLongPress={() => onLongPressKana(item)}
              onPressOut={onFinishLongPressKana}
              onPress={() => onPressKana(item)}
              showConsonant={showConsonant}
            />
          ) : (
            <View key={index.toString()} style={{ width: sizes.kanaButtonDiameter }} />
          )
        )}
      </View>
      {alternateRows.length <= 0 && <View style={{ width: sizes.verticalKey }} />}
    </View>
  );
}

export default KanaRow;
