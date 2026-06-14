export const hitTarget = {
	sm: 32,
	md: 44,
	lg: 48,
} as const;

export const buttonHeight = {
	sm: 32,
	md: 44,
	lg: 52,
} as const;

export const inputHeight = {
	sm: 36,
	md: 44,
	lg: 52,
} as const;

export const avatarSize = {
	xs: 24,
	sm: 32,
	md: 40,
	lg: 48,
	xl: 64,
	xxl: 80,
	hero: 120,
} as const;

export const iconSize = {
	xs: 16,
	sm: 20,
	md: 24,
	lg: 28,
	xl: 32,
	xxl: 48,
} as const;

export const componentHeight = {
	header: 44,
	headerAndroid: 56,
	tabBar: 49,
	tabBarSafe: 80,
	searchBar: 60,
} as const;

export type ButtonSize = keyof typeof buttonHeight;
export type InputSize = keyof typeof inputHeight;
export type AvatarSize = keyof typeof avatarSize;
export type IconSize = keyof typeof iconSize;
