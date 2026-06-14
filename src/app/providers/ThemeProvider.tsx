import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { lightTheme, darkTheme } from '~shared/presentation/theme/theme';
import { ColorContext } from '~shared/presentation/theme/useColor';
import { setDarkTheme } from '~shared/infrastructure/state/slices/appSlice';
import { setScheme } from '~shared/presentation/theme/themeStorage';
import type { RootState } from '~shared/infrastructure/state/store';

interface ThemeContextType {
	isDark: boolean;
	toggleTheme: () => void;
	theme: typeof lightTheme;
}

const ThemeContext = createContext<ThemeContextType>({
	isDark: false,
	toggleTheme: () => {},
	theme: lightTheme,
});

export const useThemeToggle = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const dispatch = useDispatch();
	const themeMode = useSelector((state: RootState) => state.appstore.theme);
	const isDark = themeMode === 'dark';
	const theme = isDark ? darkTheme : lightTheme;

	const toggleTheme = useCallback(() => {
		const newTheme = isDark ? 'light' : 'dark';
		dispatch(setDarkTheme(newTheme));
		setScheme(newTheme);
	}, [isDark, dispatch]);

	const contextValue = useMemo(
		() => ({ isDark, toggleTheme, theme }),
		[isDark, toggleTheme, theme],
	);

	return (
		<ThemeContext.Provider value={contextValue}>
			<ColorContext.Provider value={theme.colors}>
				{children}
			</ColorContext.Provider>
		</ThemeContext.Provider>
	);
};
