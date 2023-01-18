import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import Screens from './app/screens';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Screens />
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}
