import axios from 'axios';
import store from '~shared/infrastructure/state/store';
import { userLogout } from '~shared/infrastructure/state/slices/userSlice';
import { ENV } from '~config/env';

const apiClient = axios.create({
	baseURL: ENV.API_URL,
	timeout: 30000,
	headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(config => {
	const token = store.getState().user.token;
	if (token && config.headers) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

apiClient.interceptors.response.use(
	response => response,
	error => {
		if (error?.response?.status === 401) {
			store.dispatch(userLogout());
		}
		return Promise.reject(error);
	},
);

export const API_SERVICE = apiClient;
