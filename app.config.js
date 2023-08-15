module.exports = ({ config }) => {
  return {
    ...config,
    extra: {
      ...config.extra,
      amplitudeApiKey: process.env.EXPO_PUBLIC_AMPLITUDE_API_KEY,
      codeName: process.env.EXPO_PUBLIC_CODE_NAME
    }
  };
};