import { Platform, ViewStyle } from 'react-native';

export const elevation = {
	none: Platform.select<ViewStyle>({
		ios: { shadowOpacity: 0 },
		android: { elevation: 0 },
	})!,
	sm: Platform.select<ViewStyle>({
		ios: {
			shadowColor: '#000',
			shadowOffset: { width: 0, height: 1 },
			shadowOpacity: 0.08,
			shadowRadius: 2,
		},
		android: { elevation: 2 },
	})!,
	md: Platform.select<ViewStyle>({
		ios: {
			shadowColor: '#000',
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.12,
			shadowRadius: 6,
		},
		android: { elevation: 4 },
	})!,
	lg: Platform.select<ViewStyle>({
		ios: {
			shadowColor: '#000',
			shadowOffset: { width: 0, height: 4 },
			shadowOpacity: 0.16,
			shadowRadius: 12,
		},
		android: { elevation: 8 },
	})!,
	xl: Platform.select<ViewStyle>({
		ios: {
			shadowColor: '#000',
			shadowOffset: { width: 0, height: 8 },
			shadowOpacity: 0.2,
			shadowRadius: 24,
		},
		android: { elevation: 16 },
	})!,
} as const;

export type ElevationKey = keyof typeof elevation;
