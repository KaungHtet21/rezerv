import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '~core/store/store';
import { setTypographyFont, setTypographyScale } from './typography';
import { setAccentColor } from './palette';
import { updateAppFonts } from '~core/theme/theme';

export const DesignSyncProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const fontFamily = useSelector((s: RootState) => s.appstore.fontFamily);
	const fontSizeScale = useSelector((s: RootState) => s.appstore.fontSizeScale);
	const accentColor = useSelector((s: RootState) => s.appstore.accentColor);

	useEffect(() => {
		setTypographyFont(fontFamily);
		updateAppFonts(fontFamily);
	}, [fontFamily]);

	useEffect(() => {
		setTypographyScale(fontSizeScale);
	}, [fontSizeScale]);

	useEffect(() => {
		setAccentColor(accentColor);
	}, [accentColor]);

	return <>{children}</>;
};
