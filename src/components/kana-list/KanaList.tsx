import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colord } from 'colord';
import { useStyles } from '../../config/styles';
import KanaRowWithDiacritics from './KanaRowWithDiacritics';

type TypingKana = { kana: string; romaji: string };

interface KanaListProps {
  onPressKana: (kana: TypingKana) => void;
  showConsonants: boolean;
  onLongPressKana: (kana: TypingKana) => void;
  onFinishLongPressKana?: (kana: TypingKana) => void;
  kanaProvider: any;
}

function KanaList({
  onPressKana,
  showConsonants = true,
  onLongPressKana,
  onFinishLongPressKana,
  kanaProvider,
}: KanaListProps) {
  const { colors, sizes, colorScheme } = useStyles();
  const insets = useSafeAreaInsets();

  const { getKanaTable, rowIndexToConsonant, getAlternateKanaRowConsonants } = kanaProvider;

  const tableRows = getKanaTable();
  return (
    <ScrollView contentContainerStyle={{ marginTop: insets.top + sizes.expandedTopBar }}>
      {tableRows.map((row: any, index: number) => {
        const primaryConsonant = rowIndexToConsonant(index);
        return (
          <KanaRowWithDiacritics
            key={primaryConsonant}
            showConsonant={showConsonants}
            primaryRow={row}
            primaryConsonant={primaryConsonant}
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
