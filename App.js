import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import Screens from './app/screens';

/*Sentry.init({
  dsn: 'https://1ecb149b0d21ed992c4b9851438fc797@o1310900.ingest.sentry.io/4505705506013184',
  enableInExpoDevelopment: true,
  debug: false, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});*/

// super-cryptic sentry error

//Sentry.Native.captureMessage('test event')

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Screens />
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}
