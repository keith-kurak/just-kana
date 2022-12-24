import React from 'react';
import { View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useStyles } from '../config/styles';

export default function MinimalNavbarWrapper({ children }) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { colors } = useStyles();
  return (
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: colors.backgroundColor }}>
      <View style={{ height: 45, justifyContent: 'center', paddingLeft: 8 }}>
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}>
          <Ionicons name="arrow-back" size={32} color={colors.buttonTextColor} />
        </Pressable>
      </View>
      {children}
    </View>
  );
}
