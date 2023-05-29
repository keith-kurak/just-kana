import { View, Text, Pressable, Platform } from 'react-native';
import { useStyles } from '../../config/styles';
import KanaButton from './KanaButton';

function indexToDakuten(index) {
  switch (index) {
    case 0:
      return '゛';
    case 1:
      return '゜';
    default:
      return '';
  }
}

function DakutenIndicator({ consonants, showConsonant }) {
  const { colors, sizes } = useStyles();

  const wrapDakuten = (symbol, index) => (
    <Text
      key={symbol}
      allowFontScaling={false}
      style={{
        fontSize: showConsonant ? 10 : 20,
        marginLeft: showConsonant ? 0 : 5,
        color: colors.secondaryTextColor,
        textAlign: 'center',
        marginTop: Platform.OS === 'android' && !showConsonant ? -8 : undefined,
      }}>
      {showConsonant ? symbol : indexToDakuten(index)}
    </Text>
  );

  return (
    <View
      style={{
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        width: sizes.verticalKey,
        height: sizes.kanaButtonDiameter,
      }}>
      {consonants.map(wrapDakuten)}
    </View>
  );
}

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
      {alternateConsonants.length <= 0 && <View style={{ width: sizes.verticalKey }} />}
      {alternateConsonants.length ? <DakutenIndicator consonants={alternateConsonants} showConsonant={showConsonant} /> : null}
    </View>
  );
}

export default KanaRow;
