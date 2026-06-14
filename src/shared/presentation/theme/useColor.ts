import { useContext, createContext } from 'react';
import type { AppColors } from './theme';

const defaultColors: AppColors = {
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
};

export const ColorContext = createContext<AppColors>(defaultColors);

export const useColor = (): AppColors => useContext(ColorContext);
