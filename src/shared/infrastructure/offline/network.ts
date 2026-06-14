import axios from 'axios';
import type { NetInfoState } from '@react-native-community/netinfo';

export const isNetInfoOnline = (state: NetInfoState) =>
	state.isConnected === true && state.isInternetReachable !== false;

export const isNetworkError = (error: unknown) => {
	if (axios.isAxiosError(error)) {
		return !error.response || error.code === 'ERR_NETWORK';
	}
	return false;
};
