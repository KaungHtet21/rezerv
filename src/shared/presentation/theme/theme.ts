import { DarkTheme, DefaultTheme as NaviTheme } from '@react-navigation/native';

export interface AppColors {
	primary: string;
	primaryLight: string;
	softTheme: string;
	secondary: string;
	textSecondary: string;
	background: string;
	backgroundSecondary: string;
	card: string;
	soft: string;
	border: string;
	title: string;
	content: string;
	body: string;
	placeholder: string;
	inputBackground: string;
	icon: string;
	error: string;
	warning: string;
	success: string;
	btnDisable: string;
	link: string;
	surfacePrimary: string;
	surfaceLight: string;
	surfaceAccent: string;
	messageBubble: string;
	messageContent: string;
	overlay: string;
}

export type AppFontKey = 'system';

export const APP_FONT_MAP: Record<
	AppFontKey,
	{ regular: string; medium: string; semiBold: string; bold: string }
> = {
	system: {
		regular: 'System',
		medium: 'System',
		semiBold: 'System',
		bold: 'System',
	},
};

export const lightTheme = {
	...NaviTheme,
	colors: {
		...NaviTheme.colors,
		primary: '#208AEF',
		primaryLight: 'rgba(32, 138, 239, 0.2)',
		softTheme: 'rgba(32, 138, 239, 0.15)',
		secondary: '#FD2357',
		textSecondary: '#6b7280',
		background: '#FFFFFF',
		backgroundSecondary: '#F9FAFB',
		card: '#F4F7FA',
		soft: '#E6F4FE',
		border: '#E8E8EF',
		title: '#1A1F36',
		content: '#5E6687',
		body: '#6b7280',
		placeholder: '#9A9BA3',
		inputBackground: '#F4F6F5',
		icon: '#707078',
		error: '#FF3D47',
		warning: '#FFA800',
		success: '#10B981',
		btnDisable: '#A0A0A0',
		link: '#208AEF',
		surfacePrimary: '#E6F4FE',
		surfaceLight: '#F2FAFB',
		surfaceAccent: '#FFF4F5',
		messageBubble: '#F0F0F0',
		messageContent: '#414141',
		overlay: 'rgba(0, 0, 0, 0.5)',
	} satisfies AppColors,
};

export const darkTheme = {
	...DarkTheme,
	colors: {
		...DarkTheme.colors,
		primary: '#208AEF',
		primaryLight: 'rgba(32, 138, 239, 0.2)',
		softTheme: 'rgba(32, 138, 239, 0.15)',
		secondary: '#FD2357',
		textSecondary: '#9FA3A9',
		background: '#0E0F10',
		backgroundSecondary: '#18191A',
		card: '#1A1C1E',
		soft: '#0D1B2A',
		border: '#2E3134',
		title: '#FFFFFF',
		content: '#C8C9CF',
		body: '#9FA3A9',
		placeholder: '#75797E',
		inputBackground: '#1E2023',
		icon: '#D0D2D6',
		error: '#FF5C6B',
		warning: '#FFA800',
		success: '#10B981',
		btnDisable: '#A0A0A0',
		link: '#5B9BFF',
		surfacePrimary: '#0D1B2A',
		surfaceLight: '#18191A',
		surfaceAccent: '#2C1A1F',
		messageBubble: '#2E3033',
		messageContent: '#FFFFFF',
		overlay: 'rgba(0, 0, 0, 0.7)',
	} satisfies AppColors,
};

export const updateAppFonts = (_key: AppFontKey) => {};

export { useColor } from './useColor';
