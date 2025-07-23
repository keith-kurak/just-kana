import { useEffect, useCallback, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View } from 'react-native';
import WebOverlay from '@/components/WebOverlay';
import { ThemeProvider } from '@/config/styles';
import { Stack } from 'expo-router';
import { AppStateProvider } from '@/stores';
import ExpoOtaUpdateMonitor from '@/components/ExpoOtaUpdateMonitor';
import '@/utils/background-updater';
import UpdateDebugVisor from '@/components/UpdateDebugVisor';

/*Sentry.init({
  dsn: 'https://1ecb149b0d21ed992c4b9851438fc797@o1310900.ingest.sentry.io/4505705506013184',
  enableInExpoDevelopment: true,
  debug: false, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});*/

// super-cryptic sentry error

//Sentry.Native.captureMessage('test event')

// just a comment again

SplashScreen.setOptions({
  duration: 500,
  fade: true,
});

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // really got nothing to do here, but didn't want to delete everything else, I'm in a hurry
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(() => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <WebOverlay>
            <AppStateProvider>
              <Stack screenOptions={{ headerShown: false }} />
              <ExpoOtaUpdateMonitor />
              <UpdateDebugVisor visible={false} />
            </AppStateProvider>
          </WebOverlay>
        </ThemeProvider>
      </GestureHandlerRootView>
    </View>
  );
}
