import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { CButton, CScreen, CText } from '~app/common';
import { spacing, useAccent } from '~core/design';
import { useAppDispatch } from '~core/store/hooks';
import { userLogout } from '~core/store/slices/userSlice';
import type { RootState } from '~core/store/store';

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
