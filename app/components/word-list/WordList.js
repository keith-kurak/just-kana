import React, { useCallback } from 'react';
import { SectionList, View, Text, StyleSheet, Pressable } from 'react-native';
import { groupBy, sortBy, keys } from 'lodash';
import { DateTime } from 'luxon';
import ReadingKana from '../characters/ReadingKana';
import { useStyles } from '../../config/styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const keyExtractor = (item, index) => index.toString();

export default function WordList({ words, onPressWord }) {
  const { textStyles, sizes, colors } = useStyles();
  const insets = useSafeAreaInsets();

  const renderItem = useCallback(({ item }) => {
    return (
      <Pressable onPress={() => onPressWord(item)}>
        <View style={{ flexDirection: 'row', padding: sizes.medium }}>
          {item.word.map((kana, index) => (
            <ReadingKana key={index.toString()} kana={kana} />
          ))}
        </View>
      </Pressable>
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
      ItemSeparatorComponent={() => (
        <View
          style={{
            marginHorizontal: sizes.medium,
            height: StyleSheet.hairlineWidth,
            backgroundColor: colors.secondaryTextColor,
          }}
        />
      )}
      renderSectionHeader={renderSectionHeader}
      renderSectionFooter={() => <View style={{ height: 20 }} />}
      ListFooterComponent={() => <View style={{ height: insets.bottom }} />}
    />
  );
}
