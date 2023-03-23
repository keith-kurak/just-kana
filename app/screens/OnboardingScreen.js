import { Image } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import { useAppState } from '../stores';
import { useStyles } from '../config/styles';

export default function OnboardingScreen() {
  const { completeOnboarding } = useAppState();
  const { colors } = useStyles();
  const gifProps = {
    style:{height: 400, width: 9/16 * 400 }, resizeMode: "contain",
    borderWidth: 1, borderColor: colors.overlayColor
  }
  const backgroundColor = colors.backgroundColor;
  return (
    <Onboarding
     onDone={() => completeOnboarding('firstTime')}
      pages={[
        {
          backgroundColor,
          image: <Image {...gifProps} source={require('../assets/demo-0.png')} />,
          title: 'Welcome to Just Some Kana!',
          subtitle: `Your companion to find foreign/ loan words in Japanese. You can use it as a simple Gojūon reference...`,
        },
        {
          backgroundColor,
          image: <Image {...gifProps} source={require('../assets/demo-1.gif')} />,
          title: 'Learn as you type',
          subtitle: '...Or tap any kana to start typing. Tap the + button to save new words.',
        },
        {
          backgroundColor,
          image: <Image {...gifProps} source={require('../assets/demo-2.gif')} />,
          title: 'Collect new words',
          subtitle: 'Review your saved words. Tap to hear the pronunciation, look up the meaning, or copy.',
        },
        {
          backgroundColor,
          image: <Image {...gifProps} source={require('../assets/demo-3.png')} />,
          title: 'Sound out common phrases',
          subtitle: 'Some common phrases are included in the word list. Tap to hear the pronunciation.',
        },
      ]}
    />
  );
}
