import { View, Text, Platform, Image, Linking, Pressable } from 'react-native';
import { useStyles } from '../config/styles';

/**
 * Show this to be both a preview of the app and the web page for the app
 */
export default function WebOverlay({ children }) {
  const { colors, textStyles, sizes } = useStyles();
  if (Platform.OS !== 'web') {
    return children;
  }
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.backgroundColor,
        alignItems: 'center',
        paddingTop: sizes.medium,
      }}>
      <View style={{ rowGap: sizes.small, marginBottom: sizes.medium }}>
        <Text style={[textStyles.mediumDark, { textAlign: 'center' }]}>Just Some Kana</Text>
        <Text style={[textStyles.smallDark, { textAlign: 'center' }]}>
          Keep track of the katakana loan words you learn during your next trip to Japan.
        </Text>
        <Text style={[textStyles.smallDark, { textAlign: 'center' }]}>Try it out below, then download on your phone.</Text>
      </View>
      <View
        style={{
          maxWidth: 400,
          minWidth: 340,
          width: 400,
          flex: 1,
          paddingHorizontal: sizes.small,
          marginHorizontal: sizes.small,
          borderWidth: 1,
          borderRadius: sizes.small,
          borderColor: colors.buttonColor,
        }}>
        {children}
      </View>
      <View
        style={{
          marginHorizontal: sizes.medium,
          marginVertical: sizes.medium,
          alignItems: 'center',
          width: '100%',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            columnGap: sizes.large,
            width: '100%',
          }}>
          <Pressable
            onPress={() =>
              Linking.openURL(
                'https://play.google.com/store/apps/details?id=com.keithkurak.justkana'
              )
            }>
            <Image
              style={{ height: 40, width: 100 }}
              resizeMode="contain"
              source={require('../assets/play-store.png')}
            />
          </Pressable>
          <Pressable
            onPress={() =>
              Linking.openURL('https://apps.apple.com/us/app/just-some-kana/id1671606312')
            }>
            <Image
              style={{ height: 40, width: 100 }}
              resizeMode="contain"
              source={require('../assets/app-store.png')}
            />
          </Pressable>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            columnGap: sizes.large,
            width: '100%',
            marginTop: sizes.small,
          }}>
          <Text
            onPress={() => Linking.openURL('mailto:keith.kurak.appsupport@gmail.com')}
            style={[textStyles.verySmallDark, { textDecorationLine: 'underline' }]}>
            Support
          </Text>
          <Text
            onPress={() => Linking.openURL('privacy.html')}
            style={[textStyles.verySmallDark, { textDecorationLine: 'underline' }]}>
            Privacy Policy
          </Text>
        </View>
      </View>
    </View>
  );
}
