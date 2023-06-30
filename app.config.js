module.exports = ({ config }) => {
  console.warn('config', process.env.EXPO_PUBLIC_CODE_NAME);
  return {
    ...config,
    extra: {
      ...config.extra,
      amplitudeApiKey: process.env.EXPO_PUBLIC_AMPLITUDE_API_KEY,
      codeName: process.env.EXPO_PUBLIC_CODE_NAME,
      testValA: process.env.EXPO_PUBLIC_TEST_VAL_A,
      testValB: process.env.EXPO_PUBLIC_TEST_VAL_B,
    }
  };
};