import { useEffect, useContext, createContext, useState } from 'react';
import { useColorScheme, useWindowDimensions, Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';

const white = '#FFFFFF';
const notQuiteWhite = '#e8e8e8';
const black = '#000000';
const lightGray = '#A9A9A9';
const darkerGray = '#666666';
const notQuiteBlack = '#222222';
const overlayColor = '#7F7F7FBB';
const overlayColorSolid = '#7F7F7FFF';

const darkColors = ['#076FF8', '#F89007', '#9007f8', '#f8076f', '#05ae65'];

const lightColors = ['#02c6d4', '#F89007','#b969f5', '#f8076f', '#05ae65'];

const ThemeContext = createContext();

const ThemeProvider = (props) => {
  const [primaryColorIndex, setPrimaryColorIndex] = useState(0);
  return (
    // this is the provider providing state
    <ThemeContext.Provider value={{ primaryColorIndex, setPrimaryColorIndex }}>
      {props.children}
    </ThemeContext.Provider>
  );
};

const useStyles = function () {
  const { primaryColorIndex } = useContext(ThemeContext);
  const colorScheme = useColorScheme();
  const { width } = useWindowDimensions();

  const activeColorOptions = colorScheme === 'dark' ? darkColors : lightColors;

  let buttonColor = activeColorOptions[primaryColorIndex];
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
    color: darkerGray,
    fontSize: 18,
  };

  // text styles
  let mediumDark = {
    color: black,
    fontSize: 26,
  };

  let mediumLight = {
    color: darkerGray,
    fontSize: 26,
  };

  let backgroundColor = notQuiteWhite;

  if (colorScheme === 'dark') {
    backgroundColor = notQuiteBlack;
    buttonTextStyle.color = white;
    smallDark.color = white;
    smallLight.color = lightGray;
    mediumDark.color = white;
    mediumLight.color = lightGray;
  }

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync(backgroundColor);
    }
  }, [colorScheme]);

  const kanaButtonDiameter = Math.min(width - (32 * 2) / 6, 50);

  const sizes = {
    verticalKey: 32,
    topBar: 56,
    expandedTopBar: 100,
    small: 8,
    medium: 12,
    large: 16,
    kanaButtonDiameter,
    kanaButtonSpaceBetween: width / 6 - kanaButtonDiameter,
    borderRadius: 5,
  };
  const colors = {
    buttonColor,
    backgroundColor,
    buttonTextColor: buttonTextStyle.color,
    secondaryTextColor: smallLight.color,
    overlayColor,
    overlayColorSolid,
    destructive: '#FF3B30',
  };
  const textStyles = {
    buttonTextStyle,
    smallDark,
    smallLight,
    mediumDark,
    mediumLight,
  };

  return {
    sizes,
    colors,
    textStyles,
    colorScheme,
    colorOptions: activeColorOptions,
  };
};

const useTheme = function () {
  return useContext(ThemeContext);
}

export { useStyles, ThemeContext, ThemeProvider, useTheme };
