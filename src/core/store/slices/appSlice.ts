import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Appearance } from 'react-native';
import type { AppFontKey } from '~core/theme/theme';
import type { FontSizeScale } from '~core/design/typography';
import type { AccentColor } from '~core/design/palette';

const initialState = {
	theme: (Appearance.getColorScheme() || 'light') as 'light' | 'dark',
	fontFamily: 'system' as AppFontKey,
	fontSizeScale: 'md' as FontSizeScale,
	accentColor: 'blue' as AccentColor,
};

export const appStoreSlice = createSlice({
	name: 'appstore',
	initialState,
	reducers: {
		setDarkTheme: (state, { payload }: PayloadAction<'light' | 'dark'>) => {
			state.theme = payload;
		},
		setFontFamily: (state, { payload }: PayloadAction<AppFontKey>) => {
			state.fontFamily = payload;
		},
		setFontSizeScale: (state, { payload }: PayloadAction<FontSizeScale>) => {
			state.fontSizeScale = payload;
		},
		setAccent: (state, { payload }: PayloadAction<AccentColor>) => {
			state.accentColor = payload;
		},
	},
});

export const { setDarkTheme, setFontFamily, setFontSizeScale, setAccent } =
	appStoreSlice.actions;
export default appStoreSlice.reducer;
