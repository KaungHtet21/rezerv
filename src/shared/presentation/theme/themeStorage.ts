import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = 'rezerv.theme';

export const setScheme = async (scheme: 'light' | 'dark') => {
	try {
		await AsyncStorage.setItem(THEME_KEY, scheme);
	} catch {}
};

export const getScheme = async (): Promise<'light' | 'dark' | null> => {
	try {
		const value = await AsyncStorage.getItem(THEME_KEY);
		return value === 'dark' || value === 'light' ? value : null;
	} catch {
		return null;
	}
};
