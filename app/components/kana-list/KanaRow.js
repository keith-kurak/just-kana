import { View, Text, Pressable, Platform } from 'react-native';
import { useStyles } from '../../config/styles';
import KanaButton from './KanaButton';

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
            <KanaButton
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
