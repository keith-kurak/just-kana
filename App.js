import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import {  View } from 'react-native';
import Screens from './app/screens';

export default function App() {
  return (
    <View style={{flex: 1 }}>
      <Screens />
      <StatusBar style="auto" />
    </View>
  );
}
