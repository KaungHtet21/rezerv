export type AccentColor = 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'teal' | 'pink' | 'black';

export interface AccentPalette {
	primary: string;
	primaryLight: string;
	primaryDark: string;
	softTheme: string;
	surfacePrimary: string;
}

const ACCENT_PALETTES: Record<AccentColor, AccentPalette> = {
	blue: {
		primary: '#208AEF',
		primaryLight: 'rgba(32, 138, 239, 0.2)',
		primaryDark: '#1A6FCC',
		softTheme: 'rgba(32, 138, 239, 0.15)',
		surfacePrimary: '#E6F4FE',
	},
	purple: {
		primary: '#8B5CF6',
		primaryLight: 'rgba(139, 92, 246, 0.2)',
		primaryDark: '#6D28D9',
		softTheme: 'rgba(139, 92, 246, 0.15)',
		surfacePrimary: '#F3EEFF',
	},
	green: {
		primary: '#10B981',
		primaryLight: 'rgba(16, 185, 129, 0.2)',
		primaryDark: '#059669',
		softTheme: 'rgba(16, 185, 129, 0.15)',
		surfacePrimary: '#ECFDF5',
	},
	orange: {
		primary: '#F59E0B',
		primaryLight: 'rgba(245, 158, 11, 0.2)',
		primaryDark: '#D97706',
		softTheme: 'rgba(245, 158, 11, 0.15)',
		surfacePrimary: '#FFF8EB',
	},
	red: {
		primary: '#EF4444',
		primaryLight: 'rgba(239, 68, 68, 0.2)',
		primaryDark: '#DC2626',
		softTheme: 'rgba(239, 68, 68, 0.15)',
		surfacePrimary: '#FEF2F2',
	},
	teal: {
		primary: '#14B8A6',
		primaryLight: 'rgba(20, 184, 166, 0.2)',
		primaryDark: '#0D9488',
		softTheme: 'rgba(20, 184, 166, 0.15)',
		surfacePrimary: '#F0FDFA',
	},
	pink: {
		primary: '#EC4899',
		primaryLight: 'rgba(236, 72, 153, 0.2)',
		primaryDark: '#DB2777',
		softTheme: 'rgba(236, 72, 153, 0.15)',
		surfacePrimary: '#FDF2F8',
	},
	black: {
		primary: '#1A1A1A',
		primaryLight: 'rgba(26, 26, 26, 0.2)',
		primaryDark: '#000000',
		softTheme: 'rgba(26, 26, 26, 0.15)',
		surfacePrimary: '#F5F5F5',
	},
};

const DARK_SURFACE_OVERRIDES: Record<AccentColor, Partial<AccentPalette>> = {
	blue: { surfacePrimary: '#0D1B2A', softTheme: 'rgba(32, 138, 239, 0.1)' },
	purple: { surfacePrimary: '#1A0D2E', softTheme: 'rgba(139, 92, 246, 0.1)' },
	green: { surfacePrimary: '#0D2818', softTheme: 'rgba(16, 185, 129, 0.1)' },
	orange: { surfacePrimary: '#2A1A0D', softTheme: 'rgba(245, 158, 11, 0.1)' },
	red: { surfacePrimary: '#2A0D0D', softTheme: 'rgba(239, 68, 68, 0.1)' },
	teal: { surfacePrimary: '#0D2825', softTheme: 'rgba(20, 184, 166, 0.1)' },
	pink: { surfacePrimary: '#2A0D1F', softTheme: 'rgba(236, 72, 153, 0.1)' },
	black: { surfacePrimary: '#141414', softTheme: 'rgba(26, 26, 26, 0.1)' },
};

let _currentAccent: AccentColor = 'blue';

export function setAccentColor(accent: AccentColor) {
	_currentAccent = accent;
}

export function getAccentColor(): AccentColor {
	return _currentAccent;
}

export function getAccentPalette(accent?: AccentColor, isDark = false): AccentPalette {
	const key = accent || _currentAccent;
	const base = ACCENT_PALETTES[key];
	if (isDark) {
		return { ...base, ...DARK_SURFACE_OVERRIDES[key] };
	}
	return base;
}

export { ACCENT_PALETTES };
