import { Image, Dimensions } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import { colord } from 'colord';
import { useAppState } from '../stores';
import { useStyles } from '../config/styles';

export default function OnboardingScreen() {
  const { completeRequiredOnboarding } = useAppState();
  const { colors } = useStyles();
  const gifProps = {
    style: { height: 400, width: (9 / 16) * 400 },
    resizeMode: 'contain',
    borderWidth: 1,
    borderColor: colors.overlayColor,
  };

  const imageProps = {
    style: { width: Dimensions.get('window').width - 50, height: 300 },
    resizeMode: 'contain',
  }

  // check way to fix dark screens blending into dark background... no effect on light mode
  const backgroundColor = colord(colors.backgroundColor).lighten(0.1).toHex();

  return (
    <Onboarding
      onDone={completeRequiredOnboarding}
      onSkip={completeRequiredOnboarding}
      pages={[
        {
          backgroundColor,
          image: <Image {...imageProps} resiz source={require('../assets/demo-1.png')} />,
          title: 'Welcome to Just Some Kana!',
          subtitle: `Your companion to find foreign/ loan words in Japanese. You can use it as a simple Gojūon reference...`,
        },
        {
          backgroundColor,
          image: <Image {...imageProps} source={require('../assets/demo-2.png')} />,
          title: 'Learn as you type',
          subtitle: '...or tap any kana to start typing. Then tap the [+] button to save the new word you just learned.',
        },
        {
          backgroundColor,
          image: <Image {...imageProps} source={require('../assets/demo-3.png')} />,
          title: 'Hold down for other forms',
          subtitle:
            'Access dakuten, handakuten, and yōon forms by pressing down on its base form.',
        },
        {
          backgroundColor,
          image: <Image {...imageProps} source={require('../assets/demo-4.png')} />,
          title: 'Review your words',
          subtitle:
            `Tap the [カナ] button in the top right to access words you've learned and common phrases. Then tap the word to hear pronounciation, see translations, and more`,
        },
      ]}
    />
  );
}
