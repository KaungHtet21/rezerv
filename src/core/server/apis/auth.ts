import { API_SERVICE } from '../restApi';
import { API } from '~constants/api';

export type AuthResponse = {
	success: boolean;
	message?: string;
	access_token?: string;
	user?: {
		_id: string;
		email: string;
		name?: string;
	};
};

export const loginRequest = async (payload: {
	email: string;
	password: string;
}): Promise<AuthResponse> => {
	const res = await API_SERVICE.post(API.AUTH.LOGIN, payload);
	return res.data;
};

export const registerRequest = async (payload: {
	email: string;
	password: string;
}): Promise<AuthResponse> => {
	const res = await API_SERVICE.post(API.AUTH.REGISTER, payload);
	return res.data;
};
