import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '~core/store/store';
import { spacing } from './spacing';
import { radius } from './radius';
import { elevation } from './elevation';
import { typography, createTextStyle } from './typography';
import { getAccentPalette, AccentPalette } from './palette';
import { duration, spring } from './animation';
import {
	buttonHeight,
	inputHeight,
	avatarSize,
	iconSize,
	hitTarget,
	componentHeight,
} from './sizes';
import type { AppColors } from '~core/theme/theme';
import { useColor } from '~core/theme/useColor';

export interface DesignSystem {
	colors: AppColors;
	accent: AccentPalette;
	isDark: boolean;
	typography: typeof typography;
	textStyle: typeof createTextStyle;
	spacing: typeof spacing;
	radius: typeof radius;
	elevation: typeof elevation;
	buttonHeight: typeof buttonHeight;
	inputHeight: typeof inputHeight;
	avatarSize: typeof avatarSize;
	iconSize: typeof iconSize;
	hitTarget: typeof hitTarget;
	componentHeight: typeof componentHeight;
	duration: typeof duration;
	spring: typeof spring;
}

export function useDesign(): DesignSystem {
	const colors = useColor();
	const isDark = useSelector((s: RootState) => s.appstore.theme) === 'dark';
	const accentColor = useSelector((s: RootState) => s.appstore.accentColor);
	const accent = useMemo(() => getAccentPalette(accentColor, isDark), [accentColor, isDark]);

	return useMemo(
		() => ({
			colors,
			accent,
			isDark,
			typography,
			textStyle: createTextStyle,
			spacing,
			radius,
			elevation,
			buttonHeight,
			inputHeight,
			avatarSize,
			iconSize,
			hitTarget,
			componentHeight,
			duration,
			spring,
		}),
		[colors, accent, isDark],
	);
}
