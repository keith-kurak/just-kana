import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Pressable, Alert, RefreshControl, Platform } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Application from 'expo-application';
import * as Updates from 'expo-updates';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AlertAsync from 'react-native-alert-async';
import { useStyles } from '../config/styles';
import { trackAnalyticsEvent } from '../stores/analytics';
import { ScrollView } from 'react-native-gesture-handler';
import { useAppState } from '../stores';

export default function ({ onDeleteAll }) {
  const { colors, sizes, textStyles } = useStyles();
  const { bottom } = useSafeAreaInsets();
  const [isUpdateReady, setIsUpdateReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { onCopyAllToClipboard, onShareAllAsFile } = useAppState();

  useEffect(() => {
    (async function runAsync() {
      const status = await Updates.checkForUpdateAsync();
      if (status.isAvailable) {
        await Updates.fetchUpdateAsync();
        setIsUpdateReady(true);
      }
    })();
  }, []);

  const onPullToRefresh = useCallback(() => {
    (async function runAsync() {
      setIsLoading(true);
      try {
        const status = await Updates.checkForUpdateAsync();
        if (status.isAvailable) {
          await Updates.fetchUpdateAsync();
          setIsUpdateReady(true);
        }
      } catch (e) {
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const update = useCallback(async () => {
    trackAnalyticsEvent('UpdateApp');
    Updates.reloadAsync();
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

  const versionString = `v. ${Application.nativeApplicationVersion} b. ${Application.nativeBuildVersion} u. ${Updates.updateId}`;

  const versionStyle = [textStyles.smallLight, { fontSize: 14 }];

  const versionSection = (
    <View style={{ alignItems: 'center' }}>
      <Pressable
        onLongPress={() => {
          Clipboard.setStringAsync(versionString);
          Alert.alert('Version info copied!');
        }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={textStyles.smallDark}>Version info</Text>
          <Text style={versionStyle}>{Application.nativeApplicationVersion}</Text>
          <Text style={versionStyle}>{Application.nativeBuildVersion}</Text>
          <Text style={versionStyle}>{Updates.updateId}</Text>
          <Text style={versionStyle}>{process.env.EXPO_PUBLIC_CODE_NAME || '-'}</Text>
        </View>
      </Pressable>
      {isUpdateReady && (
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
