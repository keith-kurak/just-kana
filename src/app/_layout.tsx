import { useEffect, useCallback, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View } from 'react-native';
import { ThemeProvider } from '@/config/styles';
import '@/utils/background-updater';
import { Slot } from 'expo-router';
import AppMetrics from 'expo-eas-observe';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://1ecb149b0d21ed992c4b9851438fc797@o1310900.ingest.us.sentry.io/4505705506013184',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

SplashScreen.setOptions({
  duration: 500,
  fade: true,
});

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    AppMetrics.markFirstRender();
  }, []);

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
      AppMetrics.markInteractive();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <Slot />
        </ThemeProvider>
      </GestureHandlerRootView>
    </View>
  );
}
