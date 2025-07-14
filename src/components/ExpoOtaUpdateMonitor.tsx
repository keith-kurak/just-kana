import { useUpdates, fetchUpdateAsync, checkForUpdateAsync } from 'expo-updates';
import { useEffect, useState } from 'react';
import { View, Text, Pressable, AppState } from 'react-native';
import { useStyles } from '@/config/styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/build/Ionicons';

// const for testing update visuals
const OVERRIDE_OVERLAY_VISIBLE = true;

export default function ExpoOtaUpdateMonitor() {
  const { currentlyRunning, isUpdateAvailable, isUpdatePending } = useUpdates();
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
    if (isUpdateAvailable) {
      fetchUpdateAsync();
    }
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
            backgroundColor: colors.overlayColorSolid,
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
              console.log('update');
            }}>
            <Text
              style={[
                textStyles.smallDark,
                {
                  flex: 1,
                  textAlign: 'left',
                },
              ]}>
              Tap here to update
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
