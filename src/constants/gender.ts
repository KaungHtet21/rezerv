export enum GenderOption {
	MALE = 'MALE',
	FEMALE = 'FEMALE',
	PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY',
}

export const GENDER_OPTIONS = [
	{ value: GenderOption.MALE, label: 'Male' },
	{ value: GenderOption.FEMALE, label: 'Female' },
	{ value: GenderOption.PREFER_NOT_TO_SAY, label: 'Prefer not to say' },
] as const;

export const getGenderLabel = (value: GenderOption) =>
	GENDER_OPTIONS.find(option => option.value === value)?.label ?? '';
