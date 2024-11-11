import { slice, reverse } from 'lodash';
import * as Updates from 'expo-updates';
import Constants from 'expo-constants';

const secretWord = reverse(slice(require('../common')))[0].data[0].translation;

function trackAnalyticsEvent(event, properties) {
  
}

export { trackAnalyticsEvent };
