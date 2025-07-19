import { useUpdates, fetchUpdateAsync, checkForUpdateAsync, reloadAsync } from 'expo-updates';
import { useEffect, useState } from 'react';
import { View, Text, Pressable, AppState } from 'react-native';
import { useStyles } from '@/config/styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { updatesLogStore$ } from '@/stores/updatesLog';
import { ExpoUpdatesManifest } from 'expo/config';
import { isAvailableUpdateCritical } from '@/utils/update-utils';

// const for testing update visuals
const OVERRIDE_OVERLAY_VISIBLE = false;

export default function ExpoOtaUpdateMonitor() {
  const updatesSystem = useUpdates();
  const { isUpdateAvailable, isUpdatePending, availableUpdate } = updatesSystem;
  const { top } = useSafeAreaInsets();
  const { colors, textStyles, sizes } = useStyles();
  const [visible, setVisible] = useState(true);

  // check for update when app is brought back to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        checkForUpdateAsync();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // download update if available (either found on cold start or after foregrounding)
  useEffect(() => {
    (async function doAsync() {
      if (isUpdateAvailable) {
        updatesLogStore$.addUpdate({
          timestamp: new Date().toISOString(),
          version:
            (availableUpdate?.manifest as ExpoUpdatesManifest).extra?.expoClient?.version ?? '',
          updateId: availableUpdate?.updateId ?? '',
          updateType: 'foreground',
          updatePriority: isAvailableUpdateCritical(updatesSystem) ? 'critical' : 'normal',
          updateStatus: 'found',
          updateError: null,
        });
        await fetchUpdateAsync();
        updatesLogStore$.addUpdate({
          timestamp: new Date().toISOString(),
          version:
            (availableUpdate?.manifest as ExpoUpdatesManifest).extra?.expoClient?.version ?? '',
          updateId: availableUpdate?.updateId ?? '',
          updateType: 'foreground',
          updatePriority: isAvailableUpdateCritical(updatesSystem) ? 'critical' : 'normal',
          updateStatus: 'downloaded',
          updateError: null,
        });

        if (isAvailableUpdateCritical(updatesSystem)) {
          setTimeout(() => {
            reloadAsync();
          }, 3000);
        }
      }
    })();
  }, [isUpdateAvailable]);

  if (!visible) return null;

  if (isUpdatePending || OVERRIDE_OVERLAY_VISIBLE) {
    return (
      <View
        style={[
          {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            backgroundColor: isAvailableUpdateCritical(updatesSystem)
              ? colors.destructive
              : colors.overlayColorSolid,
            paddingTop: top,
          },
        ]}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Pressable
            style={{
              flex: 1,
              justifyContent: 'center',
              paddingLeft: sizes.medium,
              paddingVertical: sizes.large,
            }}
            onPress={() => {
              updatesLogStore$.addUpdate({
                timestamp: new Date().toISOString(),
                version:
                  (availableUpdate?.manifest as ExpoUpdatesManifest).extra?.expoClient?.version ??
                  '',
                updateId: availableUpdate?.updateId ?? '',
                updateType: 'foreground',
                updatePriority: isAvailableUpdateCritical(updatesSystem) ? 'critical' : 'normal',
                updateStatus: 'applied',
                updateError: null,
              });
              reloadAsync();
            }}>
            <Text
              style={[
                textStyles.smallDark,
                {
                  flex: 1,
                  textAlign: 'left',
                },
              ]}>
              {isAvailableUpdateCritical(updatesSystem)
                ? 'A critical update is available. Updating now.'
                : 'An update is available. Tap here to update.'}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setVisible(false)}
            style={{
              paddingRight: sizes.medium,
              paddingVertical: sizes.medium,
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Close update notification">
            <Ionicons color={colors.buttonTextColor} size={30} name="close-outline" />
          </Pressable>
        </View>
      </View>
    );
  }
}
