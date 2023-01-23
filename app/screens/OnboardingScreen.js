import { Image } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import { useAppState } from '../stores';

export default function OnboardingScreen() {

  const { completeOnboarding } = useAppState();
  return (
    <Onboarding
     onDone={() => completeOnboarding('firstTime')}
      pages={[
        {
          backgroundColor: '#fff',
          image: <Image source={require('../../assets/icon.png')} />,
          title: 'Onboarding 1',
          subtitle: 'Done with React Native Onboarding Swiper',
        },
        {
          backgroundColor: '#fff',
          image: <Image source={require('../../assets/icon.png')} />,
          title: 'Onboarding 2',
          subtitle: 'Done with React Native Onboarding Swiper',
        },
        {
          backgroundColor: '#fff',
          image: <Image source={require('../../assets/icon.png')} />,
          title: 'Onboarding 3',
          subtitle: 'Done with React Native Onboarding Swiper',
        },
      ]}
    />
  );
}
