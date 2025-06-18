module.exports = ({ config }) => {
  let bundleIdSuffix = '';
  if (process.env.APP_VARIANT) {
    bundleIdSuffix += process.env.APP_VARIANT.toLowerCase();
  }

  const plugins = config.plugins || [];
  plugins.push([
    "expo-dev-client",
        {
          "addGeneratedScheme	": process.env.APP_VARIANT === "DEV"
        }
  ])
  
  return {
    ...config,
    name: process.env.APP_VARIANT ? ("JSK-" + process.env.APP_VARIANT) : config.name,
    ios: {
      ...config.ios,
      bundleIdentifier: config.ios.bundleIdentifier + bundleIdSuffix,
    },
    android: {
      ...config.android,
      package: config.android.package + bundleIdSuffix,
    },
    plugins,
    extra: {
      ...config.extra,
      amplitudeApiKey: process.env.EXPO_PUBLIC_AMPLITUDE_API_KEY,
      codeName: process.env.EXPO_PUBLIC_CODE_NAME,
      testValA: process.env.EXPO_PUBLIC_TEST_VAL_A,
      testValB: process.env.EXPO_PUBLIC_TEST_VAL_B,
    }
  };
};