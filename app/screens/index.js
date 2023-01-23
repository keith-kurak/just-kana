import React from 'react';
import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppStateProvider } from '../stores';
import { useStyles, ThemeProvider } from '../config/styles';
import NavigationRoot from './NavigationRoot';

const Stack = createNativeStackNavigator();

function NavigationRootWithAppState() {
  const { colors } = useStyles();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.backgroundColor /* to make color uniform on nav transitions */,
      }}>
      <SafeAreaProvider>
        <AppStateProvider>
          <NavigationRoot />
        </AppStateProvider>
      </SafeAreaProvider>
    </View>
  );
}

export default function NavigationRootWithTheme() {
  return (
    <ThemeProvider>
      <NavigationRootWithAppState />
    </ThemeProvider>
  );
}
