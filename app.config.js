module.exports = ({ config }) => {
  let bundleIdSuffix = '';
  if (process.env.APP_VARIANT) {
    bundleIdSuffix += process.env.APP_VARIANT.toLowerCase();
  }
  if (process.env.WORKFLOW_INPUT_BUNDLE_ID_SUFFIX) {
    bundleIdSuffix += process.env.WORKFLOW_INPUT_BUNDLE_ID_SUFFIX;
  }

  const plugins = config.plugins || [];
  plugins.push([
    'expo-dev-client',
    {
      addGeneratedScheme: process.env.APP_VARIANT === 'DEV',
    },
  ]);

  let name = config.name;
  if (process.env.APP_VARIANT) {
    name = 'JSK-' + process.env.APP_VARIANT;
  }

  if (process.env.WORKFLOW_INPUT_APP_NAME) {
    name = process.env.WORKFLOW_INPUT_APP_NAME;
  }

  return {
    ...config,
    name,
    ios: {
      ...config.ios,
      bundleIdentifier: config.ios.bundleIdentifier + bundleIdSuffix,
    },
    android: {
      ...config.android,
      package: config.android.package + bundleIdSuffix,
    },
    updates: {
      ...config.updates,
      disableAntiBrickingMeasures: process.env.APP_VARIANT === 'PREVIEW',
    },
    plugins,
    extra: {
      ...config.extra,
      amplitudeApiKey: process.env.EXPO_PUBLIC_AMPLITUDE_API_KEY,
      codeName: process.env.EXPO_PUBLIC_CODE_NAME,
      testValA: process.env.EXPO_PUBLIC_TEST_VAL_A,
      testValB: process.env.EXPO_PUBLIC_TEST_VAL_B,
    },
  };
};
