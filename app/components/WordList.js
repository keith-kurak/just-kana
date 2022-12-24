import React, { useCallback } from 'react';
import { FlatList, View, Text } from 'react-native';
import ReadingKana from './characters/ReadingKana';

const keyExtractor = (item, index) => index.toString();

export default function WordList({ words }) {
  const renderItem = useCallback(({ item }) => {
    console.log(item);
    return <View style={{ flexDirection: 'row', padding: 10 }}>
      {item.map((kana, index) => (
        <ReadingKana key={index.toString()} kana={kana} />
      ))}
    </View>;
  });

  return (
    <FlatList
      contentContainerStyle={{ flex: 1 }}
      style={{ flex: 1 }}
      data={words}
      renderItem={renderItem}
    />
  );
}
