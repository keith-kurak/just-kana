module.exports = ({ config }) => {
  return {
    ...config,
    extra: {
      ...config.extra,
      amplitudeApiKey: process.env.AMPLITUDE_API_KEY,
    }
  };
};