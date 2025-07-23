import { observable } from '@legendapp/state';
import { configureSynced, syncObservable } from '@legendapp/state/sync';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { observablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage';

export interface UpdatesLogItem {
  timestamp: string;
  version: string;
  updateId: string;
  updateType: 'background' | 'foreground';
  updatePriority: 'normal' | 'critical';
  updateStatus: 'downloading' | 'downloaded' | 'applied' | 'failed' | 'found';
  updateError: string | null;
  updateVersion?: string | undefined;
}

interface UpdatesLog {
  updatesLog: UpdatesLogItem[];
  addUpdate: (update: UpdatesLogItem) => void;
}

export const updatesLogStore$ = observable<UpdatesLog>({
  updatesLog: [],
  addUpdate: (update) => {
    updatesLogStore$.updatesLog.push(update);
  },
});

const persistOptions = configureSynced({
  persist: {
    plugin: observablePersistAsyncStorage({
      AsyncStorage,
    }),
  },
});
syncObservable(
  updatesLogStore$,
  persistOptions({
    persist: {
      name: 'updatesLog',
    },
  })
);
