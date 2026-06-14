import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import appStoreReducer from './slices/appSlice';
import offlineReducer from './slices/offlineSlice';

export const rootReducer = combineReducers({
	appstore: appStoreReducer,
	user: userReducer,
	offline: offlineReducer,
});
