import { useColorScheme, useWindowDimensions } from "react-native"

const white = '#FFFFFF';
const black = '#000000';

const useStyles = function() {
  const colorScheme = useColorScheme();
  const { width } = useWindowDimensions();

  let buttonColor = 'orange';
  let buttonTextStyle = {
    color: black,
    fontSize: 30
  }
  // text styles
  let smallDark = {
    color: black,
    fontSize: 18,
  }

  let backgroundColor = white;

  if (colorScheme === 'dark') {
    backgroundColor = black;
    buttonColor = 'blue';
    buttonTextStyle.color = white;
    smallDark.color = white;
  }

  const sizes = {
    topBar: 40,
    small: 8,
    medium: 12,
    large: 16,
    kanaButtonDiameter: Math.min((width - (16 * 2) / 7), 50),
  };
  const colors = { buttonColor, backgroundColor };
  const textStyles = {
    buttonTextStyle,
    smallDark
  }

  return {
    sizes,
    colors,
    textStyles,
  }
}

export { useStyles };
