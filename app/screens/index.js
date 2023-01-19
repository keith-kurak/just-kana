import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppStateProvider } from '../stores';
import KanaScreen from './KanaScreen';
import WordListScreen from './WordListScreen';
import { useStyles, ThemeProvider } from '../config/styles';

const Stack = createNativeStackNavigator();

function NavigationRoot() {
  const { colors } = useStyles();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.backgroundColor /* to make color uniform on nav transitions */,
      }}>
      <SafeAreaProvider>
        <AppStateProvider>
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
        </AppStateProvider>
      </SafeAreaProvider>
    </View>
  );
}

export default function NavigationRootWithTheme() {
  return (
    <ThemeProvider>
      <NavigationRoot />
    </ThemeProvider>
  );
}
