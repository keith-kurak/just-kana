import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Application from 'expo-application';
import * as Updates from 'expo-updates';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStyles } from '../config/styles';

export default function ({}) {
  const { colors, colorOptions, sizes, textStyles } = useStyles();
  const { bottom } = useSafeAreaInsets();
  const [isUpdateReady, setIsUpdateReady] = useState(false);

  useEffect(() => {
    (async function runAsync() {
      const status = await Updates.checkForUpdateAsync();
      if (status.isAvailable) {
        await Updates.fetchUpdateAsync();
        setIsUpdateReady(true);
      }
    })();
  }, []);

  const optionsSection = (
    <View style={{ flex: 1 }}>
      <Text style={textStyles.mediumDark}></Text>
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
        </View>
      </Pressable>
      {isUpdateReady && (
        <Pressable style={{ marginTop: sizes.small }} onPress={Updates.reloadAsync}>
          <Text style={textStyles.smallDark}>Load latest update</Text>
        </Pressable>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.backgroundColor }}>
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: bottom,
        }}>
        {optionsSection}
        {versionSection}
      </View>
    </View>
  );
}
