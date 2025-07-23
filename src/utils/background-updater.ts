import * as TaskManager from 'expo-task-manager';
import * as BackgroundTask from 'expo-background-task';
import * as Updates from 'expo-updates';
import { updatesLogStore$ } from '@/stores/updatesLog';
import { ExpoUpdatesManifest } from 'expo/config';
import { isAvailableUpdateCritical_nonhook } from './update-utils';

const BACKGROUND_TASK_NAME = 'task-run-expo-update';

TaskManager.defineTask(BACKGROUND_TASK_NAME, async () => {
  const update = await Updates.checkForUpdateAsync();

  if (update.isAvailable) {
    const result = await Updates.fetchUpdateAsync();
    const availableUpdate = result.manifest as ExpoUpdatesManifest;
    const isAvailableUpdateCritical = isAvailableUpdateCritical_nonhook(availableUpdate);

    updatesLogStore$.addUpdate({
      timestamp: new Date().toISOString(),
      version: availableUpdate.extra?.expoClient?.version ?? '',
      updateId: availableUpdate.id ?? '',
      updateType: 'background',
      updatePriority: isAvailableUpdateCritical ? 'critical' : 'normal',
      updateStatus: 'downloaded',
      updateError: null,
    });

    updatesLogStore$.addUpdate({
      timestamp: new Date().toISOString(),
      version: availableUpdate.extra?.expoClient?.version ?? '',
      updateId: availableUpdate.id ?? '',
      updateType: 'background',
      updatePriority: 'normal',
      updateStatus: 'applied',
      updateError: null,
    });

    // You may not want to reload the app while it is backgrounded, this
    // will impact the user experience if your app state isn't saved
    // and restored.
    await Updates.reloadAsync();
  }
});

async function registerTask() {
  const isRegistered = TaskManager.isTaskRegisteredAsync(BACKGROUND_TASK_NAME);
  if (!isRegistered) {
    await BackgroundTask.registerTaskAsync(BACKGROUND_TASK_NAME, {
      minimumInterval: 30, // Try to repeat every 30 minutes while backgrounded
    });
  }
}

registerTask();
