import { View, Text, Pressable } from 'react-native';
import { useUpdates, checkForUpdateAsync, fetchUpdateAsync, reloadAsync } from 'expo-updates';

interface UpdateDebugVisorProps {
  visible?: boolean;
}

export default function UpdateDebugVisor({ visible = false }: UpdateDebugVisorProps) {
  const updates = useUpdates();

  if (!visible) return null;

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 100,
        left: 20,
        right: 20,
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 8,
        gap: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
      }}>
      <View style={{ gap: 8 }}>
        <Text style={{ color: '#000000', fontSize: 14 }}>
          isChecking: {String(updates.isChecking)}
        </Text>
        <Text style={{ color: '#000000', fontSize: 14 }}>
          isUpdateAvailable: {String(updates.isUpdateAvailable)}
        </Text>
        <Text style={{ color: '#000000', fontSize: 14 }}>
          isUpdatePending: {String(updates.isUpdatePending)}
        </Text>
        <Text style={{ color: '#000000', fontSize: 14 }}>
          updateId: {updates.availableUpdate?.updateId ?? 'none'}
        </Text>
        <Text style={{ color: '#000000', fontSize: 14 }}>
          checkError: {updates.checkError?.message ?? 'none'}
        </Text>
        <Text style={{ color: '#000000', fontSize: 14 }}>
          downloadError: {updates.downloadError?.message ?? 'none'}
        </Text>
        <Text style={{ color: '#000000', fontSize: 14 }}>
          isRestarting: {String(updates.isRestarting)}
        </Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Pressable
          onPress={() => checkForUpdateAsync()}
          style={{
            backgroundColor: '#007AFF',
            padding: 8,
            borderRadius: 4,
            flex: 1,
          }}>
          <Text style={{ color: '#ffffff', fontSize: 14, textAlign: 'center' }}>Check</Text>
        </Pressable>

        <Pressable
          onPress={() => fetchUpdateAsync()}
          style={{
            backgroundColor: '#007AFF',
            padding: 8,
            borderRadius: 4,
            flex: 1,
          }}>
          <Text style={{ color: '#ffffff', fontSize: 14, textAlign: 'center' }}>Fetch</Text>
        </Pressable>

        <Pressable
          onPress={() => reloadAsync()}
          style={{
            backgroundColor: '#FF3B30',
            padding: 8,
            borderRadius: 4,
            flex: 1,
          }}>
          <Text style={{ color: '#ffffff', fontSize: 14, textAlign: 'center' }}>Reload</Text>
        </Pressable>
      </View>
    </View>
  );
}
