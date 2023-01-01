import React, { useCallback } from 'react';
import { SectionList, View, Text } from 'react-native';
import { groupBy, sortBy, keys } from 'lodash';
import { DateTime } from 'luxon';
import ReadingKana from './characters/ReadingKana';
import { useStyles } from '../config/styles';

const keyExtractor = (item, index) => index.toString();

export default function WordList({ words }) {
  const { textStyles, sizes } = useStyles();

  const renderItem = useCallback(({ item }) => {
    console.log(item);
    return (
      <View style={{ flexDirection: 'row', padding: 10 }}>
        {item.word.map((kana, index) => (
          <ReadingKana key={index.toString()} kana={kana} />
        ))}
      </View>
    );
  });

  const renderSectionHeader = useCallback(({ section: { title } }) => (
    <Text style={[{ paddingLeft: sizes.small }, textStyles.smallLight]}>
      {DateTime.fromSQL(title).toLocaleString(DateTime.DATE_MED)}
    </Text>
  ));

  const groups = groupBy(words, (w) => DateTime.fromISO(w.date).toFormat('yyyy-MM-dd'));

  let sections = sortBy(
    keys(groups).map((key) => ({ title: key, data: groups[key] })),
    'title'
  ).reverse();

  return (
    <SectionList
      contentContainerStyle={{ flex: 1 }}
      style={{ flex: 1 }}
      sections={sections}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
    />
  );
}
