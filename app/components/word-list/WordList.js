import React, { useCallback } from 'react';
import { SectionList, View, Text } from 'react-native';
import { groupBy, sortBy, keys } from 'lodash';
import { DateTime } from 'luxon';
import ReadingKana from '../characters/ReadingKana';
import { useStyles } from '../../config/styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const keyExtractor = (item, index) => index.toString();

export default function WordList({ words }) {
  const { textStyles, sizes } = useStyles();
  const insets = useSafeAreaInsets();

  const renderItem = useCallback(({ item }) => {
    return (
      <View style={{ flexDirection: 'row', padding: 10 }}>
        {item.word.map((kana, index) => (
          <ReadingKana key={index.toString()} kana={kana} />
        ))}
      </View>
    );
  });

  const renderSectionHeader = useCallback(({ section: { title } }) => (
    <Text allowFontScaling={false} style={[{ paddingLeft: sizes.small }, textStyles.smallLight]}>
      {DateTime.fromSQL(title).toLocaleString(DateTime.DATE_MED)}
    </Text>
  ));

  const groups = groupBy(sortBy(words, (w) => w.date).reverse(), (w) =>
    DateTime.fromISO(w.date).toFormat('yyyy-MM-dd')
  );

  let sections = keys(groups).map((key) => ({ title: key, data: groups[key] }));

  return (
    <SectionList
      sections={sections}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      renderSectionFooter={() => <View style={{ height: 20 }} />}
      ListFooterComponent={() => <View style={{ height: insets.bottom }} />}
    />
  );
}
