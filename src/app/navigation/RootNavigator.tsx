import React, { useCallback, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import * as SplashScreen from 'expo-splash-screen';
import { lightTheme, darkTheme } from '~shared/presentation/theme/theme';
import type { RootState } from '~shared/infrastructure/state/store';
import AuthStack from './AuthStack';
import UnAuthStack from './UnAuthStack';
import { navigationRef } from './config/navigationRef';

SplashScreen.preventAutoHideAsync().catch(() => {});

const RootNavigator = () => {
	const token = useSelector((state: RootState) => state.user.token);
	const themeMode = useSelector((state: RootState) => state.appstore.theme);
	const navTheme = themeMode === 'dark' ? darkTheme : lightTheme;
	const [navReady, setNavReady] = useState(false);

	const onReady = useCallback(() => {
		setNavReady(true);
	}, []);

	useEffect(() => {
		if (navReady) {
			SplashScreen.hideAsync().catch(() => {});
		}
	}, [navReady]);

	useEffect(() => {
		const timer = setTimeout(() => {
			SplashScreen.hideAsync().catch(() => {});
			setNavReady(true);
		}, 3000);
		return () => clearTimeout(timer);
	}, []);

	return (
		<NavigationContainer
			ref={navigationRef}
			theme={navTheme as any}
			onReady={onReady}>
			{token ? <AuthStack /> : <UnAuthStack />}
		</NavigationContainer>
	);
};

export default RootNavigator;
