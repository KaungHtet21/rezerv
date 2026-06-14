import type { PendingMutation } from '~core/offline/types';

export type OfflineState = {
	isOnline: boolean | null;
	queue: PendingMutation[];
	isSyncing: boolean;
};

export const offlineInitialState: OfflineState = {
	isOnline: null,
	queue: [],
	isSyncing: false,
};

export type OfflineRootState = {
	offline?: OfflineState;
};

export const getOfflineState = (state: OfflineRootState): OfflineState =>
	state.offline ?? offlineInitialState;
