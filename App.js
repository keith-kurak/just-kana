import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import KanaList from './app/KanaList';

export default function App() {
  return (
    <View style={{flex: 1 }}>
      <KanaList />
      <StatusBar style="auto" />
    </View>
  );
}
