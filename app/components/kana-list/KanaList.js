import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colord } from 'colord';
import {
  getKanaTable,
  rowIndexToConsonant,
  getAlternateKanaRows,
  getAlternateKanaRowConsonants,
} from '../../kana-utils';
import { useStyles } from '../../config/styles';
import KanaRowSwitcher from './KanaRowSwitcher';

function KanaList({ onPressKana, showConsonants = true, onLongPressKana, onFinishLongPressKana }) {
  const { colors, sizes, colorScheme } = useStyles();
  const insets = useSafeAreaInsets();

  const tableRows = getKanaTable();
  return (
    <ScrollView contentContainerStyle={{ marginTop: insets.top + sizes.expandedTopBar }}>
      {tableRows.map((row, index) => {
        const primaryConsonant = rowIndexToConsonant(index);
        return (
          <KanaRowSwitcher
            key={primaryConsonant}
            showConsonant={showConsonants}
            primaryRow={row}
            primaryConsonant={primaryConsonant}
            alternateRows={getAlternateKanaRows(primaryConsonant)}
            alternateConsonants={getAlternateKanaRowConsonants(primaryConsonant)}
            color={colord(colors.buttonColor)[colorScheme + 'en'](0.02 * index).toHex()}
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
