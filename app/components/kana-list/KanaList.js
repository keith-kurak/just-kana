import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colord } from 'colord';
import { useStyles } from '../../config/styles';
import KanaRowWithDiacritics from './KanaRowWithDiacritics';

function KanaList({ onPressKana, showConsonants = true, onLongPressKana, onFinishLongPressKana, kanaProvider }) {
  const { colors, sizes, colorScheme } = useStyles();
  const insets = useSafeAreaInsets();

  const { getKanaTable, rowIndexToConsonant, getAlternateKanaRows, getAlternateKanaRowConsonants } =
    kanaProvider;

  const tableRows = getKanaTable();
  return (
    <ScrollView contentContainerStyle={{ marginTop: insets.top + sizes.expandedTopBar }}>
      {tableRows.map((row, index) => {
        const primaryConsonant = rowIndexToConsonant(index);
        return (
          <KanaRowWithDiacritics
            key={primaryConsonant}
            showConsonant={showConsonants}
            primaryRow={row}
            primaryConsonant={primaryConsonant}
            alternateRows={getAlternateKanaRows(primaryConsonant)}
            alternateConsonants={getAlternateKanaRowConsonants(primaryConsonant)}
            color={colord(colors.buttonColor)
              [colorScheme + 'en'](0.02 * index)
              .toHex()}
            onPressKana={onPressKana}
            onLongPressKana={onLongPressKana}
            onFinishLongPressKana={onFinishLongPressKana}
          />
        );
      })}
      <View style={{ height: 240 + insets.bottom }} />
    </ScrollView>
  );
}

export default KanaList;
