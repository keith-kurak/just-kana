import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import KanaScreen from './KanaScreen';

export default function () {
  return (
    <SafeAreaProvider>
      <KanaScreen />
    </SafeAreaProvider>
  );
}
