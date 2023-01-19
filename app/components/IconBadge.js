import React from 'react';
import { View, Text } from 'react-native';
import { useStyles } from '../config/styles';

export default function IconBadge({ children, badgeCount, color, size }) {
  const { colors, sizes } = useStyles();
  return (
    <View>
      {children}
      {badgeCount > 0 && (
        <View
          style={{
            position: 'absolute',
            right: -9,
            top: -13,
            backgroundColor: color,
            borderRadius: 13,
            paddingHorizontal: 3,
            height: 26,
            minWidth: 26,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            allowFontScaling={false}
            style={{ color: colors.buttonTextColor, fontSize: 18, fontWeight: 'bold' }}>
            {badgeCount}
          </Text>
        </View>
      )}
    </View>
  );
}
