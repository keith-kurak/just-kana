import WebOverlay from '@/components/WebOverlay';
import { Stack } from 'expo-router';
import { AppStateProvider } from '@/stores';
import ExpoOtaUpdateMonitor from '@/components/ExpoOtaUpdateMonitor';
import '@/utils/background-updater';
import UpdateDebugVisor from '@/components/UpdateDebugVisor';
import HighlightedWordOfTheDay from '@/components/HighlightedWordOfTheDay';

export default function App() {
  return (
    <WebOverlay>
      <AppStateProvider>
        <Stack screenOptions={{ headerShown: false }} />
        <ExpoOtaUpdateMonitor />
        <HighlightedWordOfTheDay />
        <UpdateDebugVisor visible={false} />
      </AppStateProvider>
    </WebOverlay>
  );
}
