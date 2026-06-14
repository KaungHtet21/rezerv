export type AuthUser = {
	_id: string;
	email: string;
	name?: string;
};

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

export const GENDERS: Gender[] = [
	'MALE',
	'FEMALE',
	'OTHER',
	'PREFER_NOT_TO_SAY',
];
