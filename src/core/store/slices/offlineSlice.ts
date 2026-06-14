import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { enqueueMutation } from '~core/offline/queueCoalesce';
import { syncOfflineQueue } from '~core/offline/syncEngine';
import type { PendingMutation, PendingMutationInput } from '~core/offline/types';
import {
	getOfflineState,
	offlineInitialState,
	type OfflineRootState,
} from './offlineState';

export { offlineInitialState } from './offlineState';

export const runOfflineSync = createAsyncThunk(
	'offline/runSync',
	async (_, { getState }) => {
		const offline = getOfflineState(getState() as OfflineRootState);
		if (!offline.isOnline || offline.queue.length === 0 || offline.isSyncing) {
			return offline.queue;
		}

		const { remainingQueue } = await syncOfflineQueue(offline.queue);
		return remainingQueue;
	},
);

const offlineSlice = createSlice({
	name: 'offline',
	initialState: offlineInitialState,
	reducers: {
		setNetworkStatus(state, action: PayloadAction<boolean | null>) {
			state.isOnline = action.payload;
		},
		queueMutation(state, action: PayloadAction<PendingMutationInput>) {
			state.queue = enqueueMutation(state.queue, action.payload);
		},
		setQueue(state, action: PayloadAction<PendingMutation[]>) {
			state.queue = action.payload;
		},
	},
	extraReducers: builder => {
		builder
			.addCase(runOfflineSync.pending, state => {
				state.isSyncing = true;
			})
			.addCase(runOfflineSync.fulfilled, (state, action) => {
				state.isSyncing = false;
				state.queue = action.payload;
			})
			.addCase(runOfflineSync.rejected, state => {
				state.isSyncing = false;
			});
	},
});

export const { setNetworkStatus, queueMutation, setQueue } = offlineSlice.actions;
export const selectIsOnline = (state: OfflineRootState) =>
	getOfflineState(state).isOnline;
export const selectPendingCount = (state: OfflineRootState) =>
	getOfflineState(state).queue.length;
export const selectIsSyncing = (state: OfflineRootState) =>
	getOfflineState(state).isSyncing;

export default offlineSlice.reducer;
