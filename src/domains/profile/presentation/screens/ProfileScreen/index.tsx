import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { CButton, CScreen, CText } from '~shared/presentation/ui';
import { spacing, useAccent } from '~shared/presentation/design';
import { useAppDispatch } from '~shared/infrastructure/state/hooks';
import { userLogout } from '~shared/infrastructure/state/slices/userSlice';
import type { RootState } from '~shared/infrastructure/state/store';

const ProfileScreen = () => {
	const dispatch = useAppDispatch();
	const accent = useAccent();
	const user = useSelector((state: RootState) => state.user.user);

	const handleLogout = () => {
		dispatch(userLogout());
	};

	return (
		<CScreen isTabScreen entering isFull contentStyle={styles.container}>
			<View style={styles.hero}>
				<CText variant="headline" weight="bold">
					Profile
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
					Manage your account and preferences.
				</CText>
			</View>
			<CButton
				title="Log out"
				onPress={handleLogout}
				variant="outline"
				size="lg"
			/>
		</CScreen>
	);
};

export default ProfileScreen;

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
