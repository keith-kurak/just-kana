import React from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useStyles } from '../config/styles';

interface MinimalNavbarWrapperProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  rightButton?: React.ReactNode;
  center?: React.ReactNode;
}

export default function MinimalNavbarWrapper({
  children,
  showBackButton = true,
  rightButton,
  center,
}: MinimalNavbarWrapperProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useStyles();
  return (
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: colors.backgroundColor }}>
      <View
        style={{
          height: 56,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 8,
        }}>
        {showBackButton ? (
          <Pressable
            onPress={() => {
              router.back();
            }}>
            <Ionicons name="arrow-back" size={40} color={colors.buttonTextColor} />
          </Pressable>
        ) : null}
        {center ? center : <View />}
        {rightButton ? rightButton : <View />}
      </View>
      {children}
    </View>
  );
}
