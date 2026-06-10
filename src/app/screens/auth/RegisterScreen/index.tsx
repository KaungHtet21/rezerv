import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { CBackground } from '~app/common';
import { spacing } from '~core/design';
import {
	AuthFooterWithLink,
	AuthScreenHeader,
	AuthTitleWithBrand,
} from '../components';
import RegisterForm from './RegisterForm';

const RegisterScreen = () => (
	<CBackground edges={['top', 'bottom']}>
		<ScrollView
			contentContainerStyle={[
				styles.scrollContent,
				{ paddingHorizontal: spacing.lg, paddingTop: spacing.md },
			]}
			keyboardShouldPersistTaps="handled">
			<AuthScreenHeader />
			<View style={styles.content}>
				<AuthTitleWithBrand prefix="Join" suffix="today" />
				<RegisterForm />
			</View>
		</ScrollView>
		<AuthFooterWithLink
			message="Already have an account?"
			linkText="Log in"
			navigateTo="LoginScreen"
		/>
	</CBackground>
);

export default RegisterScreen;

const styles = StyleSheet.create({
	scrollContent: {
		flexGrow: 1,
	},
	content: {
		flex: 1,
		paddingTop: 50,
	},
});
