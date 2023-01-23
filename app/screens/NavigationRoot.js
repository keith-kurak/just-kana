import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import KanaScreen from './KanaScreen';
import WordListScreen from './WordListScreen';
import { useAppState } from '../stores';
import OnboardingScreen from './OnboardingScreen';

const Stack = createNativeStackNavigator();

export default function NavigationRoot() {
  const { isLoaded, initialOnboardingRequired } = useAppState();

  if (!isLoaded) {
    return null;
  }

  if (initialOnboardingRequired) {
    return <OnboardingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          //presentation: 'modal',
          header: () => null,
        }}>
        <Stack.Screen name="Home" component={KanaScreen} />
        <Stack.Screen name="Words" component={WordListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
