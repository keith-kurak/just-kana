import React from 'react';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useStyles } from '../config/styles';

export default function ({}) {
  const { colors, colorOptions, sizes } = useStyles();
  const { bottom } = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: colors.backgroundColor }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Settings</Text>
      </View>
    </View>
  );
}
