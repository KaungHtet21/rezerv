import store from '~shared/infrastructure/state/store';
import { applyOfflineQueueToCache } from './applyOfflineQueueToCache';
import { offlineInitialState } from '~shared/infrastructure/state/slices/offlineState';
import { queueMutation, runOfflineSync } from '~shared/infrastructure/state/slices/offlineSlice';
import type { PendingMutationInput } from './types';

export const queueOfflineMutation = (payload: PendingMutationInput) => {
	store.dispatch(queueMutation(payload));

	const offline = store.getState().offline ?? offlineInitialState;
	if (offline.isOnline === true) {
		store.dispatch(runOfflineSync());
	}
};

export const reapplyOfflineQueueToCache = () => {
	const offline = store.getState().offline ?? offlineInitialState;
	if (offline.queue.length > 0) {
		applyOfflineQueueToCache(offline.queue);
	}
};

export const triggerOfflineSyncIfNeeded = () => {
	const offline = store.getState().offline ?? offlineInitialState;
	if (offline.isOnline === true && offline.queue.length > 0 && !offline.isSyncing) {
		store.dispatch(runOfflineSync());
	}
};
