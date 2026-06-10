import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import appStoreReducer from './slices/appSlice';

export const rootReducer = combineReducers({
	appstore: appStoreReducer,
	user: userReducer,
});
