import { useColorScheme } from "react-native"

const useStyles = function() {
  const colorScheme = useColorScheme();

  let buttonColor = 'orange';
  let buttonTextStyle = {
    color: 'black', 
    fontSize: 30
  }
  // text styles
  let smallDark = {
    color: 'black',
    fontSize: 18,
  }

  let backgroundColor = 'white';

  if (colorScheme === 'dark') {
    backgroundColor = 'black';
    buttonColor = 'blue';
    buttonTextStyle.color = 'white';
    smallDark.color = 'white';
  }

  const sizes = {};
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
