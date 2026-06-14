import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { CScreen } from '~shared/presentation/ui';
import { spacing } from '~shared/presentation/design';
import {
	AuthFooterWithLink,
	AuthScreenHeader,
	AuthTitleWithBrand,
} from '../components';
import VerifyEmailForm from './VerifyEmailForm';

const VerifyEmailScreen = () => {
	const route = useRoute<any>();
	const email = route?.params?.email || '';

	return (
		<CScreen
			isScroll
			entering
			contentContainerStyle={styles.scrollContent}
			footer={
				<AuthFooterWithLink
					message="Already verified?"
					linkText="Log in"
					navigateTo="LoginScreen"
				/>
			}>
			<AuthScreenHeader />
			<View style={styles.content}>
				<AuthTitleWithBrand prefix="Verify your" suffix="email" />
				<VerifyEmailForm email={email} />
			</View>
		</CScreen>
	);
};

export default VerifyEmailScreen;

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
