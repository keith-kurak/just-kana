import { View, Text } from 'react-native';
import { useStyles } from '@/config/styles';
import MinimalNavbarWrapper from '@/components/MinimalNavbarWrapper';
import { LegendList } from '@legendapp/list';
import { UpdatesLogItem, updatesLogStore$ } from '@/stores/updatesLog';

const USE_SAMPLE_DATA = false;

const SAMPLE_DATA: UpdatesLogItem[] = [
  {
    timestamp: '2021-01-01',
    version: '1.0.0',
    updateId: '1234567890',
    updateType: 'background',
    updatePriority: 'normal',
    updateStatus: 'downloading',
    updateError: null,
  },
  {
    timestamp: '2021-01-02',
    version: '1.0.1',
    updateId: '1234567891',
    updateType: 'foreground',
    updatePriority: 'normal',
    updateStatus: 'downloaded',
    updateError: null,
  },
  {
    timestamp: '2021-01-03',
    version: '1.0.2',
    updateId: '1234567892',
    updateType: 'foreground',
    updatePriority: 'normal',
    updateStatus: 'applied',
    updateError: null,
  },
];

export default function UpdateInfo() {
  const { colors, textStyles, sizes } = useStyles();

  const items = (USE_SAMPLE_DATA ? SAMPLE_DATA : updatesLogStore$.updatesLog.get())
    .reverse()
    .filter((item) => item.updateStatus === 'applied');

  return (
    <MinimalNavbarWrapper showBackButton>
      <View style={{ flex: 1, backgroundColor: colors.backgroundColor, padding: 20 }}>
        <Text style={[textStyles.mediumDark, { marginBottom: 16 }]}>Update Information</Text>
        <LegendList
          data={items}
          renderItem={({ item }) => (
            <View style={{ marginBottom: sizes.medium, columnGap: sizes.small }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                }}>
                <Text
                  style={[
                    textStyles.mediumDark,
                    {
                      marginBottom: 12,
                      color:
                        item.updateStatus === 'applied'
                          ? 'green'
                          : item.updateStatus === 'downloaded'
                            ? 'yellow'
                            : colors.buttonTextColor,
                    },
                  ]}>
                  {item.version}-{item.updateVersion}
                </Text>
                <Text
                  style={[
                    textStyles.smallLight,
                    {
                      marginBottom: 12,
                      color:
                        item.updateStatus === 'applied'
                          ? 'green'
                          : item.updateStatus === 'downloaded'
                            ? 'yellow'
                            : colors.buttonTextColor,
                    },
                  ]}>
                  {item.updateStatus}
                </Text>
              </View>
              <Text style={[textStyles.smallLight, { marginBottom: 12 }]}>
                {item.timestamp.toString()}
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={[textStyles.smallLight, { marginBottom: 12 }]}>
                  {item.updateId} / {item.updateType} / {item.updatePriority}
                </Text>
                <Text style={[textStyles.smallLight, { marginBottom: 12 }]}>
                  {item.updateError}
                </Text>
              </View>
            </View>
          )}
        />
      </View>
    </MinimalNavbarWrapper>
  );
}
