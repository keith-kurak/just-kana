module.exports = ({ config }) => {
  const myPlugins = config.plugins;
  myPlugins.push([
    "expo-dev-client", {
      addGeneratedScheme: process.env.DEV_VERSION
    }
  ])
  return {
    ...config,
    name: process.env.DEV_VERSION ? `${config.name} - DEV` : config.name,
    ios: {
      ...config.ios,
      bundleIdentifier: process.env.DEV_VERSION ? `${config.ios.bundleIdentifier}-dev` : config.ios.bundleIdentifier,
    },
    android: {
      ...config.android,
      package: process.env.DEV_VERSION ? `${config.android.package}dev` : config.android.package,
    },
    plugins: myPlugins,
    extra: {
      ...config.extra,
      amplitudeApiKey: process.env.EXPO_PUBLIC_AMPLITUDE_API_KEY,
      codeName: process.env.EXPO_PUBLIC_CODE_NAME,
      testValA: process.env.EXPO_PUBLIC_TEST_VAL_A,
      testValB: process.env.EXPO_PUBLIC_TEST_VAL_B,
    }
  };
};