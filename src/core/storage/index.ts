import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Storage } from 'redux-persist';

export const reduxStorage: Storage = {
	setItem: (key, value) => AsyncStorage.setItem(key, value),
	getItem: key => AsyncStorage.getItem(key),
	removeItem: key => AsyncStorage.removeItem(key),
};
