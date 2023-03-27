import { init, identify, Identify, track } from '@amplitude/analytics-react-native';
import * as Updates from 'expo-updates';
import Constants from 'expo-constants';

const common = require('../common');

const amplitudeAvailable = Constants.expoConfig.extra && Constants.expoConfig.extra.amplitudeApiKey;

if (amplitudeAvailable) {
  init(Constants.expoConfig.extra.amplitudeApiKey);

  const identifyObj = new Identify();
  identifyObj.set('updateId', Updates.updateId);
  identifyObj.set('channel', Updates.channel);
  identifyObj.set('firstWord', common[0].data[0].translation);
  identify(identifyObj);

  track('AppLaunched', {
    updateId: Updates.updateId,
    channel: Updates.channel,
    firstWord: common[0].data[0].translation,
  });

  /*
    // For update acceptance, add this event
    track('ReceivedTargetedUpdate', {
      updateId: Updates.updateId,
      channel: Updates.channel,
      firstWord: common[0].data[0].translation,
    });
  */
}

function trackAnalyticsEvent(event, properties) {
  if (amplitudeAvailable) {
    if (properties) {
      track(event, properties);
    } else {
      track(event);
    }
  }
}

export { trackAnalyticsEvent };
