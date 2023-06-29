module.exports = {
  dependencies: {
    '@amplitude/analytics-react-native': {
      platforms: {
        // we only use this for bluetooth permissions on Android 12
        // we remove it to avoid configuring stuff in the Podfile (see https://www.npmjs.com/package/react-native-permissions)
        android: null,
      },
    },
  },
};