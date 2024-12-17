import { View, Pressable, Text } from 'react-native';
import { useStyles } from '../config/styles';
import { useUpdates, checkForUpdateAsync, fetchUpdateAsync, reloadAsync } from 'expo-updates';
import { useAppState } from '@react-native-community/hooks';
import { useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const UpdateOverlay = function UpdateOverlay() {
  const currentAppState = useAppState();

  const { isUpdatePending } = useUpdates();

  const { top } = useSafeAreaInsets();

  const { colors, spacing, sizes, textStyles } = useStyles();

  useEffect(() => {
    if (currentAppState === 'active') {
      checkForUpdateAsync().then(() => {
        fetchUpdateAsync().then(() => {
          console.log('update fetched');
        });
      });
    }
  });

  if (!isUpdatePending) {
    return null;
  }

  return (
    <Pressable
      onPress={() => {
        reloadAsync();
      }}
      style={{
        position: 'absolute',
        top: 0,
        paddingTop: top,
        left: 0,
        right: 0,
        backgroundColor: colors.overlayColorSolid,
      }}>
      <View
        style={[
          {
            borderBottomWidth: 1,
            borderBottomColor: colors.tint,
            padding: sizes.medium,
            flexDirection: 'row',
            alignItems: 'center',
          },
        ]}>
        <View style={{ flex: 1, rowGap: sizes.small }}>
          <Text style={textStyles.mediumDark}>App Update Available</Text>
          <Text style={textStyles.smallDark}>{'Tap here to update'}</Text>
        </View>
      </View>
    </Pressable>
  );
};
