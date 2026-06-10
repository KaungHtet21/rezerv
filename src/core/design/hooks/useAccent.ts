import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '~core/store/store';
import { getAccentPalette, type AccentPalette } from '../palette';

export function useAccent(): AccentPalette {
	const isDark = useSelector((s: RootState) => s.appstore.theme) === 'dark';
	const accentColor = useSelector((s: RootState) => s.appstore.accentColor);

	return useMemo(
		() => getAccentPalette(accentColor, isDark),
		[accentColor, isDark],
	);
}
