import { observable } from '@legendapp/state';
import { syncObservable } from '@legendapp/state/sync';
import { ObservablePersistLocalStorage } from '@legendapp/state/persist-plugins/local-storage';

export interface UpdatesLogItem {
  timestamp: string;
  version: string;
  updateId: string;
  updateType: 'background' | 'foreground';
  updatePriority: 'normal' | 'critical';
  updateStatus: 'downloading' | 'downloaded' | 'applied' | 'failed';
  updateError: string | null;
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

// Persist the observable to the named key of the global persist plugin
syncObservable(updatesLogStore$, {
  persist: {
    name: 'persistKey',
    plugin: ObservablePersistLocalStorage,
  },
});
