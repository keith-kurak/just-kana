import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, Alert, RefreshControl, Platform, AppState } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Application from 'expo-application';
import {
  useUpdates,
  reloadAsync,
  checkForUpdateAsync,
  fetchUpdateAsync,
  updateId,
} from 'expo-updates';
import Constants from 'expo-constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AlertAsync from 'react-native-alert-async';
import { useStyles } from '../config/styles';
import { trackAnalyticsEvent } from '../stores/analytics';
import { ScrollView } from 'react-native-gesture-handler';
import { useAppState } from '../stores';
import { useRouter } from 'expo-router';
import { updatesLogStore$ } from '@/stores/updatesLog';
import { ExpoUpdatesManifest } from 'expo/config';
import { isAvailableUpdateCritical } from '@/utils/update-utils';

export default function Settings({ onDeleteAll }: { onDeleteAll: () => void }) {
  const { colors, sizes, textStyles } = useStyles();
  const { bottom } = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const { onCopyAllToClipboard, onShareAllAsFile } = useAppState();
  const [secretVersionTapCount, setSecretVersionTapCount] = useState(0);
  const { navigate } = useRouter();

  const updatesSystem = useUpdates();
  const { isUpdatePending, availableUpdate } = updatesSystem;

  const onPullToRefresh = useCallback(() => {
    (async function runAsync() {
      setIsLoading(true);
      try {
        const status = await checkForUpdateAsync();
        if (status.isAvailable) {
          await fetchUpdateAsync();
        }
      } catch (e) {
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const update = useCallback(async () => {
    trackAnalyticsEvent('UpdateApp');
    updatesLogStore$.addUpdate({
      timestamp: new Date().toISOString(),
      version: (availableUpdate?.manifest as ExpoUpdatesManifest).extra?.expoClient?.version ?? '',
      updateVersion: (availableUpdate?.manifest as ExpoUpdatesManifest).extra?.updateVersion ?? '',
      updateId: availableUpdate?.updateId ?? '',
      updateType: 'foreground',
      updatePriority: isAvailableUpdateCritical(updatesSystem) ? 'critical' : 'normal',
      updateStatus: 'applied',
      updateError: null,
    });
    reloadAsync();
  }, []);

  const confirmDelete = useCallback(() => {
    (async function doAsync() {
      const choice = await AlertAsync(
        'Really delete all words?',
        'This cannot be undone',
        [
          { text: 'Yes, Delete', onPress: () => 'yes', style: 'destructive' },
          { text: 'No', onPress: () => Promise.resolve('no') },
        ],
        {
          cancelable: true,
          onDismiss: () => 'no',
        }
      );
      if (choice === 'yes') {
        const choice = await AlertAsync(
          'Are you sure?',
          '',
          [
            { text: 'Yes, Delete!!', onPress: () => 'yes', style: 'destructive' },
            { text: 'No', onPress: () => Promise.resolve('no') },
          ],
          {
            cancelable: true,
            onDismiss: () => 'no',
          }
        );
        if (choice === 'yes') {
          onDeleteAll();
          Alert.alert('All words deleted!');
        }
      }
    })();
  }, [onDeleteAll]);

  const optionsSection = (
    <View style={{ flex: 1, justifyContent: 'space-around', width: '100%', rowGap: sizes.large }}>
      <View style={{ alignItems: 'center', rowGap: sizes.small }}>
        <Text style={[textStyles.mediumDark]}>Export words</Text>
        <Text style={textStyles.smallLight}>Save your learned words for posterity.</Text>
        <Pressable onPress={onCopyAllToClipboard}>
          <View
            style={{
              padding: sizes.medium,
              borderRadius: sizes.borderRadius,
              backgroundColor: colors.buttonColor,
              marginTop: sizes.small,
            }}>
            <Text style={[textStyles.smallDark, { color: colors.buttonTextColor }]}>
              Copy all to clipboard
            </Text>
          </View>
        </Pressable>
        {Platform.OS === 'web' ? null : (
          <Pressable onPress={onShareAllAsFile}>
            <View
              style={{
                padding: sizes.medium,
                borderRadius: sizes.borderRadius,
                backgroundColor: colors.buttonColor,
                marginTop: sizes.small,
              }}>
              <Text style={[textStyles.smallDark, { color: colors.buttonTextColor }]}>
                Export all to text file
              </Text>
            </View>
          </Pressable>
        )}
      </View>
      <View style={{ alignItems: 'center', rowGap: sizes.small }}>
        <Text style={[textStyles.mediumDark]}>Delete all words</Text>
        <Text style={textStyles.smallLight}>Restart with a blank slate.</Text>
        <Text style={[textStyles.smallDark, { color: colors.destructive }]}>
          This cannot be undone!
        </Text>
        <Pressable onPress={confirmDelete}>
          <View
            style={{
              padding: sizes.medium,
              borderRadius: sizes.borderRadius,
              backgroundColor: colors.destructive,
              marginTop: sizes.small,
            }}>
            <Text style={[textStyles.smallDark, { color: colors.buttonTextColor }]}>
              Delete everything
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );

  const versionString = `v. ${Application.nativeApplicationVersion} b. ${Application.nativeBuildVersion} u. ${updateId}`;

  const versionStyle = [textStyles.smallLight, { fontSize: 14 }];

  const versionSection = (
    <View style={{ alignItems: 'center' }}>
      <Pressable
        onPress={() => {
          setSecretVersionTapCount(secretVersionTapCount + 1);
          if (secretVersionTapCount === 3) {
            navigate('/update-info');
            setSecretVersionTapCount(0);
          }
        }}
        onLongPress={() => {
          Clipboard.setStringAsync(versionString);
          Alert.alert('Version info copied!');
        }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={textStyles.smallDark}>Version info</Text>
          <Text style={versionStyle}>
            {Application.nativeApplicationVersion}-
            {Constants.expoConfig?.extra?.updateVersion || '0'}
          </Text>
          <Text style={versionStyle}>{Application.nativeBuildVersion}</Text>
          <Text style={versionStyle}>{updateId}</Text>
        </View>
      </Pressable>
      {isUpdatePending && (
        <Pressable style={{ marginTop: sizes.small }} onPress={update}>
          <Text style={textStyles.smallDark}>Load latest update</Text>
        </Pressable>
      )}
    </View>
  );

  return (
    <ScrollView
      contentContainerStyle={{ flex: 1, backgroundColor: colors.backgroundColor }}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onPullToRefresh} />}>
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: bottom,
        }}>
        {optionsSection}
        {Platform.OS === 'web' ? null : versionSection}
      </View>
    </ScrollView>
  );
}
