import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { CScreen } from '~shared/presentation/ui';
import { spacing } from '~shared/presentation/design';
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
		<CScreen
			isScroll
			entering
			contentContainerStyle={styles.scrollContent}
			footer={
				<AuthFooterWithLink
					message="Don't have an account?"
					linkText="Sign up"
					navigateTo="RegisterScreen"
				/>
			}>
			<AuthScreenHeader />
			<View style={styles.content}>
				<AuthTitleWithBrand prefix="Welcome back to" />
				<LoginForm
					prefillEmail={prefillEmail}
					onEmailChange={setCurrentEmail}
				/>
			</View>
		</CScreen>
	);
};

export default LoginScreen;

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
