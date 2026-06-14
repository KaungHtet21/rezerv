import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CScreen } from '~shared/presentation/ui';
import { spacing } from '~shared/presentation/design';
import {
	AuthFooterWithLink,
	AuthScreenHeader,
	AuthTitleWithBrand,
} from '../components';
import RegisterForm from './RegisterForm';

const RegisterScreen = () => {
	const insets = useSafeAreaInsets();
	const androidExtraScroll = Platform.OS === 'android' ? spacing.xxxl * 2 : spacing.xxxl;

	return (
		<CScreen entering keyboardAware={false}>
			<AuthScreenHeader />
			<KeyboardAwareScrollView
				style={styles.scroll}
				contentContainerStyle={[
					styles.scrollContent,
					{ paddingBottom: insets.bottom + spacing.xxxl },
				]}
				keyboardShouldPersistTaps="handled"
				enableOnAndroid
				enableAutomaticScroll
				extraScrollHeight={androidExtraScroll}
				extraHeight={androidExtraScroll}
				showsVerticalScrollIndicator={false}>
				<View style={styles.content}>
					<AuthTitleWithBrand prefix="Join" suffix="today" />
					<RegisterForm />
					<View style={styles.footer}>
						<AuthFooterWithLink
							message="Already have an account?"
							linkText="Log in"
							navigateTo="LoginScreen"
						/>
					</View>
				</View>
			</KeyboardAwareScrollView>
		</CScreen>
	);
};

export default RegisterScreen;

const styles = StyleSheet.create({
	scroll: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
		paddingTop: spacing.md,
	},
	content: {
		paddingTop: 50,
	},
	footer: {
		marginTop: spacing.xxxl,
	},
});
