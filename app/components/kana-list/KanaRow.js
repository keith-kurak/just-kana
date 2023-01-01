import { View, Text, Pressable } from 'react-native';
import { useStyles } from '../../config/styles';

function Consonant({ text, show }) {
  const { textStyles, colors, sizes } = useStyles();
  const myText = !show || text.startsWith('~') ? ' ' : text;
  return (
    <Text
      style={{
        width: sizes.verticalKey,
        fontSize: 16,
        textAlign: 'center',
        color: colors.buttonTextColor,
        alignSelf: 'center',
      }}>
      {myText}
    </Text>
  );
}

function DakutenIndicator({ hasHandakuten }) {
  const { textStyles, colors, sizes } = useStyles();
  const myText = hasHandakuten ? '⋅\n⋅' : '⋅';
  return (
    <Text
      style={{
        width: sizes.verticalKey,
        fontSize: 16,
        textAlign: 'center',
        color: colors.buttonTextColor,
        alignSelf: 'center',
      }}>
      {myText}
    </Text>
  );
}

function Kana({ kana, onPress, color }) {
  const { textStyles, sizes } = useStyles();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
      <View
        style={{
          height: sizes.kanaButtonDiameter,
          width: sizes.kanaButtonDiameter,
          backgroundColor: color,
          borderRadius: sizes.kanaButtonDiameter / 2,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={textStyles.buttonTextStyle}>{kana.kana}</Text>
      </View>
    </Pressable>
  );
}

function KanaRow({ items, onPressKana, color, consonant, showConsonant, alternateRowCount = 0 }) {
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
            <Kana color={color} key={item.kana} kana={item} onPress={() => onPressKana(item)} />
          ) : (
            <View key={index.toString()} style={{ width: sizes.kanaButtonDiameter }} />
          )
        )}
      </View>
      {alternateRowCount > 0 ? (
        <DakutenIndicator hasHandakuten={alternateRowCount > 1} />
      ) : (
        <View style={{ width: sizes.verticalKey }} />
      )}
    </View>
  );
}

export default KanaRow;
