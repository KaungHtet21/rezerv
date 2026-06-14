import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CScreen } from '~shared/presentation/ui';
import { spacing } from '~shared/presentation/design';
import {
	AuthFooterWithLink,
	AuthScreenHeader,
	AuthTitleWithBrand,
} from '../components';
import RegisterForm from './RegisterForm';

const RegisterScreen = () => (
	<CScreen
		isScroll
		entering
		contentContainerStyle={styles.scrollContent}
		footer={
			<AuthFooterWithLink
				message="Already have an account?"
				linkText="Log in"
				navigateTo="LoginScreen"
			/>
		}>
		<AuthScreenHeader />
		<View style={styles.content}>
			<AuthTitleWithBrand prefix="Join" suffix="today" />
			<RegisterForm />
		</View>
	</CScreen>
);

export default RegisterScreen;

const styles = StyleSheet.create({
	scrollContent: {
		flexGrow: 1,
		paddingTop: spacing.md,
	},
	content: {
		flex: 1,
		paddingTop: 50,
	},
});
