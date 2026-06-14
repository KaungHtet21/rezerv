import {
	persistStore,
	persistReducer,
	createMigrate,
	type PersistedState,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
} from 'redux-persist';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './rootReducer';
import { offlineInitialState } from './slices/offlineState';
import { reduxStorage } from '~core/storage';

const migrations = {
	1: (state: PersistedState) => {
		if (!state) {
			return state;
		}

		const persisted = state as PersistedState & {
			offline?: typeof offlineInitialState;
		};

		return {
			...persisted,
			offline: persisted.offline ?? offlineInitialState,
		};
	},
};

const persistConfig = {
	key: 'root',
	version: 1,
	storage: reduxStorage,
	whitelist: ['appstore', 'user', 'offline'],
	migrate: createMigrate(migrations, { debug: false }),
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
	reducer: persistedReducer,
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
