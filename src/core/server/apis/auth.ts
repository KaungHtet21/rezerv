import type { AuthUser } from '~core/store/slices/userSlice';

export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
export type UserStatus = 'PENDING' | 'APPROVED';

export type SafeUser = {
	id: string;
	email: string;
	phone: string;
	name: string;
	profilePic: string | null;
	gender: Gender;
	dob: string;
	country: string;
	address: string;
	status: UserStatus;
	createdAt: string;
	updatedAt: string;
};

export type SignInPayload = {
	email: string;
	password: string;
};

export type SignUpPayload = {
	email: string;
	phone: string;
	name: string;
	profilePic?: string;
	gender: Gender;
	dob: string;
	country: string;
	address: string;
	password: string;
};

export type VerifyEmailPayload = {
	email: string;
	code: string;
};

export type ResendVerificationPayload = {
	email: string;
};

export type SignInResponse = {
	accessToken: string;
	user: SafeUser;
};

export type SignUpResponse = {
	message: string;
	user: SafeUser;
};

export type VerifyEmailResponse = {
	message: string;
	user: SafeUser;
};

export type ResendVerificationResponse = {
	message: string;
	sendsRemaining: number;
};

export const GENDERS: Gender[] = [
	'MALE',
	'FEMALE',
	'OTHER',
	'PREFER_NOT_TO_SAY',
];

export const toAuthUser = (user: SafeUser): AuthUser => ({
	_id: user.id,
	email: user.email,
	name: user.name,
});

export const getApiErrorMessage = (error: any, fallback: string): string => {
	const message = error?.response?.data?.message;
	if (Array.isArray(message)) {
		return message.join(', ');
	}
	if (typeof message === 'string') {
		return message;
	}
	return error?.message || fallback;
};
