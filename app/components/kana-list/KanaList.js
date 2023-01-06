import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  getKanaTable,
  rowIndexToConsonant,
  getAlternateKanaRows,
  getAlternateKanaRowConsonants,
} from '../../kana-utils';
import { useStyles } from '../../config/styles';
import KanaRowSwitcher from './KanaRowSwitcher';

function KanaList({ onPressKana, showConsonants = true, onLongPressKana, onFinishLongPressKana }) {
  const { colors, sizes } = useStyles();
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
            color={colors.buttonColor}
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
