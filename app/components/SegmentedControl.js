import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useStyles } from '../config/styles';

function SegmentedControl({ options, selectedIndex, onChange }) {
  const { colors, sizes, textStyles } = useStyles();

  const selectedColor = colors.buttonTextColor;
  const unselectedColor = colors.backgroundColor;

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: selectedColor,
        borderRadius: sizes.borderRadius,
        borderWidth: 1,
        borderColor: selectedColor,
        overflow: 'hidden',
      }}>
      {options.map((option, index) => (
        <Pressable
          key={option}
          onPress={() => onChange(index)}
          style={{
            padding: sizes.small,
            backgroundColor:
              index === selectedIndex ? selectedColor : unselectedColor,
          }}>
          <Text
            allowFontScaling={false}
            style={[ {
              fontSize: 12,
              color: index === selectedIndex ? unselectedColor : selectedColor,
            }]}>
            {option}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

export default SegmentedControl;
