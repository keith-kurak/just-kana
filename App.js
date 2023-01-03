import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { TranslatorProvider } from 'react-native-translator';
import Screens from './app/screens';

export default function App() {
  return (
    <TranslatorProvider>
      <View style={{ flex: 1 }}>
        <Screens />
        <StatusBar style="auto" />
      </View>
    </TranslatorProvider>
  );
}
