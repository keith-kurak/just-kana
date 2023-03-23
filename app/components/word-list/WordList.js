import React, { useCallback } from 'react';
import { SectionList, View, Text, StyleSheet, Pressable } from 'react-native';
import { groupBy, sortBy, keys } from 'lodash';
import { DateTime } from 'luxon';
import { Ionicons } from '@expo/vector-icons';
import ReadingKana from '../characters/ReadingKana';
import { useStyles } from '../../config/styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const keyExtractor = (item, index) => index.toString();

export default function WordList({ words, onPressWord, grouping = 'date' }) {
  const { textStyles, sizes, colors } = useStyles();
  const insets = useSafeAreaInsets();

  const renderItem = useCallback(({ item }) => {
    return (
      <Pressable onPress={() => onPressWord(item)}>
        <View style={{ flexDirection: 'row', flex: 1, padding: sizes.medium }}>
          <View style={{ flex: 1, paddingRight: sizes.medium }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {item.word.map((kana, index) => (
                <ReadingKana key={index.toString()} kana={kana} />
              ))}
            </View>
            {item.translation && (
              <View style={{ marginTop: sizes.small, alignSelf: 'center' }}>
                <Text
                  style={[
                    textStyles.smallLight,
                    { fontStyle: 'italic' },
                  ]}>{`"${item.translation}"`}</Text>
              </View>
            )}
          </View>
          <Ionicons
            style={{ alignSelf: 'center' }}
            name="md-ellipsis-vertical-outline"
            size={24}
            color={colors.secondaryTextColor}
          />
        </View>
      </Pressable>
    );
  });

  const renderDateSectionHeader = useCallback(({ section: { title } }) => (
    <Text allowFontScaling={false} style={[{ paddingLeft: sizes.medium }, textStyles.smallLight]}>
      {DateTime.fromSQL(title).toLocaleString(DateTime.DATE_MED)}
    </Text>
  ));

  const renderTextSectionHeader = useCallback(({ section: { title } }) => (
    <Text allowFontScaling={false} style={[{ paddingLeft: sizes.medium }, textStyles.smallLight]}>
      {title}
    </Text>
  ));

  let sections;
  let renderSectionHeader;

  // we have a list of words that need to be grouped into dates
  if (grouping === 'date') {
    renderSectionHeader = renderDateSectionHeader;
    const groups = groupBy(sortBy(words, (w) => w.date).reverse(), (w) =>
      DateTime.fromISO(w.date).toFormat('yyyy-MM-dd')
    );

    sections = keys(groups).map((key) => ({ title: key, data: groups[key] }));
  } else {
    // groups have already been specified
    // (yes this is gross)
    renderSectionHeader = renderTextSectionHeader;
    sections = words;
  }

  return (
    <SectionList
      contentContainerStyle={{ flexGrow: 1 }}
      sections={sections}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      stickySectionHeadersEnabled={false}
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
      ListEmptyComponent={() => (
        <View style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={textStyles.smallDark}>Go back and add your first word!</Text>
        </View>
      )}
    />
  );
}
