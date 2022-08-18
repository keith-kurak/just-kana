import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import KanaList from './app/KanaList';
import Screens from './app/screens';
import KanaScreen from './app/screens/KanaScreen';

export default function App() {
  return (
    <View style={{flex: 1 }}>
      <Screens />
      <StatusBar style="auto" />
    </View>
  );
}
