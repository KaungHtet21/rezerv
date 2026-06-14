import { Platform, TextStyle } from 'react-native';
import { APP_FONT_MAP, AppFontKey } from '~shared/presentation/theme/theme';

export type FontSizeScale = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const SCALE_MULTIPLIERS: Record<FontSizeScale, number> = {
	xs: 0.85,
	sm: 0.92,
	md: 1.0,
	lg: 1.1,
	xl: 1.2,
};

const BASE_SIZES = {
	caption: 11,
	label: 13,
	bodySmall: 14,
	body: 15,
	bodyLarge: 17,
	subtitle: 19,
	title: 21,
	titleLarge: 25,
	headline: 29,
	display: 35,
} as const;

export type FontSizeToken = keyof typeof BASE_SIZES;
export type FontWeight = 'regular' | 'medium' | 'semiBold' | 'bold';

let _currentFontKey: AppFontKey = 'system';
let _currentScale: FontSizeScale = 'md';

export function setTypographyFont(key: AppFontKey) {
	_currentFontKey = key;
}

export function setTypographyScale(scale: FontSizeScale) {
	_currentScale = scale;
}

export function getTypographyFont(): AppFontKey {
	return _currentFontKey;
}

export function getTypographyScale(): FontSizeScale {
	return _currentScale;
}

function getFontFamily(fontKey: AppFontKey, weight: FontWeight): string | undefined {
	const family = APP_FONT_MAP[fontKey] || APP_FONT_MAP.system;
	if (Platform.OS === 'ios') {
		return family[weight];
	}
	return family.regular;
}

function getFontWeight(weight: FontWeight): TextStyle['fontWeight'] {
	if (Platform.OS === 'ios') {
		return undefined;
	}
	const map: Record<FontWeight, TextStyle['fontWeight']> = {
		regular: '400',
		medium: '500',
		semiBold: '600',
		bold: '700',
	};
	return map[weight];
}

export function createTextStyle(
	token: FontSizeToken,
	weight: FontWeight = 'regular',
	overrides?: Partial<TextStyle>,
): TextStyle {
	const multiplier = SCALE_MULTIPLIERS[_currentScale];
	const fontSize = Math.round(BASE_SIZES[token] * multiplier);
	const fontFamily = getFontFamily(_currentFontKey, weight);
	const lineHeight = Math.round(fontSize * (Platform.OS === 'android' ? 1.5 : 1.4));

	return {
		fontSize,
		fontFamily,
		fontWeight: getFontWeight(weight),
		lineHeight,
		...overrides,
	};
}

export const typography = {
	get display() { return createTextStyle('display', 'bold'); },
	get headline() { return createTextStyle('headline', 'bold'); },
	get titleLarge() { return createTextStyle('titleLarge', 'bold'); },
	get title() { return createTextStyle('title', 'semiBold'); },
	get subtitle() { return createTextStyle('subtitle', 'medium'); },
	get bodyLarge() { return createTextStyle('bodyLarge', 'regular'); },
	get body() { return createTextStyle('body', 'regular'); },
	get bodyBold() { return createTextStyle('body', 'bold'); },
	get bodySmall() { return createTextStyle('bodySmall', 'regular'); },
	get label() { return createTextStyle('label', 'medium'); },
	get labelBold() { return createTextStyle('label', 'bold'); },
	get caption() { return createTextStyle('caption', 'regular'); },
	get input() { return createTextStyle('bodyLarge', 'regular'); },
	get inputLabel() { return createTextStyle('label', 'medium'); },
	get buttonLarge() { return createTextStyle('bodyLarge', 'semiBold'); },
	get button() { return createTextStyle('body', 'semiBold'); },
	get buttonSmall() { return createTextStyle('label', 'semiBold'); },
} as const;

export { BASE_SIZES, SCALE_MULTIPLIERS };
