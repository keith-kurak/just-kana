import { useColorScheme, useWindowDimensions } from 'react-native';

const white = '#FFFFFF';
const black = '#000000';
const lightGray = '#A9A9A9';
const notQuiteBlack = '#222222';
const overlayColor = '#7F7F7FBB';

const useStyles = function () {
  const colorScheme = useColorScheme();
  const { width } = useWindowDimensions();

  let buttonColor = 'orange';
  let buttonTextStyle = {
    color: black,
    fontSize: 30,
  };
  // text styles
  let smallDark = {
    color: black,
    fontSize: 18,
  };

  let smallLight = {
    color: lightGray,
    fontSize: 18,
  };

  let backgroundColor = white;

  if (colorScheme === 'dark') {
    backgroundColor = notQuiteBlack;
    buttonColor = 'blue';
    buttonTextStyle.color = white;
    smallDark.color = white;
  }

  const sizes = {
    verticalKey: 32,
    topBar: 56,
    expandedTopBar: 80,
    small: 8,
    medium: 12,
    large: 16,
    kanaButtonDiameter: Math.min(width - (32 * 2) / 6, 50),
  };
  const colors = {
    buttonColor,
    backgroundColor,
    buttonTextColor: buttonTextStyle.color,
    secondaryTextColor: lightGray,
    overlayColor,
  };
  const textStyles = {
    buttonTextStyle,
    smallDark,
    smallLight,
  };

  return {
    sizes,
    colors,
    textStyles,
  };
};

export { useStyles };
