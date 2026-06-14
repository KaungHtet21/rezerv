import type { Gender, SafeUser } from './entities';

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
