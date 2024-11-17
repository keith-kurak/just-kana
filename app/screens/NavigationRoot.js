import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';
import KanaScreen from './KanaScreen';
import WordListScreen from './WordListScreen';
import { useAppState } from '../stores';
import OnboardingScreen from './OnboardingScreen';
import SettingsScreen from './SettingsScreen';

const Stack = createNativeStackNavigator();

export default function NavigationRoot() {
  const { isLoaded, initialOnboardingRequired } = useAppState();

  if (!isLoaded) {
    return null;
  }

  if (initialOnboardingRequired && Platform.OS !== 'web') {
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
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
