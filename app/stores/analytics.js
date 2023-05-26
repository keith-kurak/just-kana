import { init, identify, Identify, track } from '@amplitude/analytics-react-native';
import { slice, reverse } from 'lodash';
import * as Updates from 'expo-updates';
import Constants from 'expo-constants';

const secretWord = reverse(slice(require('../common')))[0].data[0].translation;

const amplitudeAvailable = Constants.expoConfig.extra && Constants.expoConfig.extra.amplitudeApiKey;

if (amplitudeAvailable) {
  init(Constants.expoConfig.extra.amplitudeApiKey);

  const identifyObj = new Identify();
  identifyObj.set('updateId', Updates.updateId || 'local');
  identifyObj.set('channel', Updates.channel || 'local');
  identifyObj.set('secretWord', secretWord);
  identify(identifyObj);

  track('AppLaunched', {
    updateId: Updates.updateId || 'local',
    channel: Updates.channel || 'local',
    secretWordForEvent: secretWord,
  });

  /*
    // For update acceptance, add this event
    track('ReceivedTargetedUpdate1', {
      updateId: Updates.updateId,
      channel: Updates.channel,
      secretWordForEvent: reverse(common)[0].data[0].translation,
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
