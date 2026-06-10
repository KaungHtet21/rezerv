import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { CBackground } from '~app/common';
import { spacing } from '~core/design';
import {
	AuthFooterWithLink,
	AuthScreenHeader,
	AuthTitleWithBrand,
} from '../components';
import LoginForm from './LoginForm';

const LoginScreen = () => {
	const route = useRoute<any>();
	const prefillEmail = route?.params?.prefillEmail || '';
	const [, setCurrentEmail] = useState(prefillEmail);

	return (
		<CBackground edges={['top', 'bottom']}>
			<ScrollView
				contentContainerStyle={[
					styles.scrollContent,
					{ paddingHorizontal: spacing.lg, paddingTop: spacing.md },
				]}
				keyboardShouldPersistTaps="handled">
				<AuthScreenHeader />
				<View style={styles.content}>
					<AuthTitleWithBrand prefix="Welcome back to" />
					<LoginForm
						prefillEmail={prefillEmail}
						onEmailChange={setCurrentEmail}
					/>
				</View>
			</ScrollView>
			<AuthFooterWithLink
				message="Don't have an account?"
				linkText="Sign up"
				navigateTo="RegisterScreen"
			/>
		</CBackground>
	);
};

export default LoginScreen;

const styles = StyleSheet.create({
	scrollContent: {
		flexGrow: 1,
	},
	content: {
		flex: 1,
		paddingTop: 50,
	},
});
