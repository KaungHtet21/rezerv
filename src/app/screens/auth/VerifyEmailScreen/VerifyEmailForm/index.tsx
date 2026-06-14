import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CInput, CButton } from '~app/common';
import { spacing } from '~core/design';
import { useResendVerification, useVerifyEmail } from '~core/server/mutations/auth';
import { getApiErrorMessage } from '~core/server/apis/auth';

type Props = {
	email: string;
};

const VerifyEmailForm = ({ email }: Props) => {
	const navigation = useNavigation<any>();
	const [code, setCode] = useState('');
	const [codeError, setCodeError] = useState('');

	const { mutate: verifyEmail, isLoading: isVerifying } = useVerifyEmail({
		onSuccess: data => {
			Alert.alert('Verified', data.message, [
				{
					text: 'Sign in',
					onPress: () =>
						navigation.navigate('LoginScreen', {
							prefillEmail: email,
						}),
				},
			]);
		},
		onError: error => {
			Alert.alert(getApiErrorMessage(error, 'Verification failed. Try again.'));
		},
	});

	const { mutate: resendVerification, isLoading: isResending } =
		useResendVerification({
			onSuccess: data => {
				Alert.alert(
					'Code sent',
					`${data.message}. ${data.sendsRemaining} resend(s) remaining.`,
				);
			},
			onError: error => {
				Alert.alert(getApiErrorMessage(error, 'Could not resend code.'));
			},
		});

	const disable = !code || isVerifying || isResending;

	const handleVerify = () => {
		const trimmedCode = code.trim();
		if (trimmedCode.length < 5 || trimmedCode.length > 6) {
			setCodeError('Enter the verification code from your email');
			return;
		}
		setCodeError('');

		verifyEmail({ email, code: trimmedCode });
	};

	const handleResend = () => {
		resendVerification({ email });
	};

	return (
		<>
			<View style={{ width: '100%', marginBottom: spacing.sm }}>
				<CInput
					value={email}
					label="Email"
					editable={false}
					autoCapitalize="none"
				/>
				<CInput
					value={code}
					onChangeText={value => {
						setCode(value.replace(/\D/g, '').slice(0, 6));
						if (codeError) setCodeError('');
					}}
					label="Verification code"
					placeholder="123456"
					error={codeError}
					keyboardType="number-pad"
					maxLength={6}
				/>
			</View>
			<CButton
				title="Verify email"
				onPress={handleVerify}
				disabled={disable}
				loading={isVerifying}
				size="lg"
			/>
			<View style={{ marginTop: spacing.md }}>
				<CButton
					title="Resend code"
					onPress={handleResend}
					disabled={isVerifying || isResending}
					loading={isResending}
					variant="outline"
					size="lg"
				/>
			</View>
		</>
	);
};

export default VerifyEmailForm;
