import axios from 'axios';
import store from '~core/store/store';
import { userLogout } from '~core/store/slices/userSlice';
import { SERVER } from '~constants/api';

const apiClient = axios.create({
	baseURL: SERVER.API_URL,
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
