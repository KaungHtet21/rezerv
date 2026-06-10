import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { CBackground, CButton, CText } from '~app/common';
import { spacing, useAccent } from '~core/design';
import { useAppDispatch } from '~core/store/hooks';
import { userLogout } from '~core/store/slices/userSlice';
import type { RootState } from '~core/store/store';

const MainScreen = () => {
	const dispatch = useAppDispatch();
	const accent = useAccent();
	const user = useSelector((state: RootState) => state.user.user);

	const handleLogout = () => {
		dispatch(userLogout());
	};

	return (
		<CBackground edges={['top', 'bottom']}>
			<View style={styles.container}>
				<View style={styles.hero}>
					<CText variant="headline" weight="bold">
						Welcome
					</CText>
					<CText
						variant="subtitle"
						color={accent.primary}
						style={{ marginTop: spacing.sm }}>
						{user?.name || user?.email || 'Guest'}
					</CText>
					<CText
						variant="body"
						color={accent.primary}
						style={{ marginTop: spacing.xl, opacity: 0.8 }}>
						You are signed in to Rezerv.
					</CText>
				</View>
				<CButton
					title="Log out"
					onPress={handleLogout}
					variant="outline"
					size="lg"
				/>
			</View>
		</CBackground>
	);
};

export default MainScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: spacing.xxl,
		paddingTop: spacing.massive,
		justifyContent: 'space-between',
		paddingBottom: spacing.xxl,
	},
	hero: {
		flex: 1,
		justifyContent: 'center',
	},
});
