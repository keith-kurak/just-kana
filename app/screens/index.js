import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppStateProvider } from '../stores';
import KanaScreen from './KanaScreen';
import WordListScreen from './WordListScreen';

const Stack = createNativeStackNavigator();

export default function () {
  return (
    <SafeAreaProvider>
      <AppStateProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              presentation: 'modal',
              header: () => null,
            }}>
            <Stack.Screen name="Home" component={KanaScreen} />
            <Stack.Screen name="Words" component={WordListScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </AppStateProvider>
    </SafeAreaProvider>
  );
}
