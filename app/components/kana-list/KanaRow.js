import { View, Text, Pressable } from 'react-native';
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

function DakutenIndicator({ hasHandakuten }) {
  const { colors, sizes } = useStyles();
  const dakuten = '゛';
  const handakuten = '゜';
  const wrapDakuten = (symbol) => (
    <Text
      allowFontScaling={false}
      key={symbol}
      style={{ fontSize: 26, color: colors.secondaryTextColor, textAlign: 'center' }}>
      {symbol}
    </Text>
  );
  const inner = hasHandakuten
    ? [wrapDakuten(dakuten), wrapDakuten(handakuten)]
    : wrapDakuten(dakuten);
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: sizes.verticalKey,
        paddingTop: 10,
        paddingLeft: 10,
      }}>
      {inner}
    </View>
  );
}

function Kana({ kana, onPress, onLongPress, onPressOut, color }) {
  const { textStyles, sizes } = useStyles();
  return (
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
        <Text allowFontScaling={false} style={textStyles.buttonTextStyle}>
          {kana.kana}
        </Text>
      </View>
    </Pressable>
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
  alternateRowCount = 0,
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
            />
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
