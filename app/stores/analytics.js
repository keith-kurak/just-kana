import { init, identify, Identify, track } from '@amplitude/analytics-react-native';
import Updates from 'expo-updates';
import Constants from 'expo-constants';

const common = require('../common');

const amplitudeAvailable = Constants.expoConfig.extra && Constants.expoConfig.extra.amplitudeApiKey;

if (Constants.expoConfig.extra && Constants.expoConfig.extra.amplitudeApiKey) {
  init(Constants.expoConfig.extra.aplitudeApiKey);

  const identifyObj = new Identify();
  identifyObj.set('updateId', Updates.updateId);
  identifyObj.set('channel', Updates.channel);
  identifyObj.set('firstWord', common[0].data[0].translation);
  identify(identifyObj);
}

function trackAnalyticsEvent(event) {
  if (amplitudeAvailable) {
    track(event);
  }
}

export { trackAnalyticsEvent };
