import React from 'react';
import { View, Text } from 'react-native';
import { useStyles } from '../config/styles';

export default function ({ savedWords }) {
  const { textStyles } = useStyles();

  return (
    <View style={{ height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginHorizontal: 20 }}>
      {savedWords.length ? (
        <View style={{ backgroundColor: 'red', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5}}>
          <Text style={textStyles.smallDark}>{savedWords.length}</Text>
        </View>
      ) : null}
    </View>
  );
}
