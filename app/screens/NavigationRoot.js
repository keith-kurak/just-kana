import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform, View } from 'react-native';
import KanaScreen from './KanaScreen';
import WordListScreen from './WordListScreen';
import { useAppState } from '../stores';
import OnboardingScreen from './OnboardingScreen';
import SettingsScreen from './SettingsScreen';
import { SystemBars } from 'react-native-edge-to-edge';
import { useStyles } from '../config/styles';

const Stack = createNativeStackNavigator();

export default function NavigationRoot() {
  const { isLoaded, initialOnboardingRequired } = useAppState();

  const [ mountSystemBars, setMountSystemBars ] = useState(false);

  const { colorScheme } = useStyles();

  // workaround for how something seems to be forcing the status bar to dark mode.
  // So I'm setting it after it gets flipped to dark mode
  useEffect(() => {
    setTimeout(() => {
      if (Platform.OS === 'android' && colorScheme === "light")
      setMountSystemBars(true);
    }, 1000)
  }, [ colorScheme ]);

  if (!isLoaded) {
    return null;
  }

  if (initialOnboardingRequired && Platform.OS !== 'web') {
    return <OnboardingScreen />;
  }

  return (
    <View style={{ flex: 1 }}>
      {mountSystemBars && <SystemBars style="auto" />}
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            //presentation: 'modal',
            header: () => null,
            statusBarTranslucent: true,
            navigationBarTranslucent: true,
            navigationBarColor: 'transparent',
            statusBarBackgroundColor: 'transparent',
          }}>
          <Stack.Screen name="Home" component={KanaScreen} />
          <Stack.Screen name="Words" component={WordListScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}
