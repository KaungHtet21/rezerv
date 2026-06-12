import React, { useEffect, useState } from 'react';
import { Alert, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CInput, CButton, IconComp } from '~app/common';
import { spacing, useColors } from '~core/design';
import { validateEmail, validatePassword } from '~core/utils/validation';
import { useSignIn } from '~core/server/api-fetch';
import { getApiErrorMessage, toAuthUser } from '~core/server/apis/auth';
import { useAppDispatch } from '~core/store/hooks';
import { loginData } from '~core/store/slices/userSlice';

type Props = {
	prefillEmail?: string;
	onEmailChange?: (email: string) => void;
};

const LoginForm = ({ prefillEmail = '', onEmailChange }: Props) => {
	const dispatch = useAppDispatch();
	const navigation = useNavigation<any>();
	const colors = useColors();
	const [email, setEmail] = useState(prefillEmail);
	const [emailError, setEmailError] = useState('');
	const [password, setPassword] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [showPassword, setShowPassword] = useState(false);

	const { mutate: signIn, isLoading } = useSignIn({
		onSuccess: data => {
			dispatch(
				loginData({
					access_token: data.accessToken,
					user: toAuthUser(data.user),
				}),
			);
		},
		onError: error => {
			const msg = getApiErrorMessage(error, 'Login failed. Try again.');
			if (msg.toLowerCase().includes('verify')) {
				Alert.alert('Email not verified', msg, [
					{ text: 'Cancel', style: 'cancel' },
					{
						text: 'Verify email',
						onPress: () =>
							navigation.navigate('VerifyEmailScreen', {
								email: email.trim().toLowerCase(),
							}),
					},
				]);
				return;
			}
			Alert.alert(msg);
		},
	});

	const disable = !email || !password || isLoading;

	useEffect(() => {
		onEmailChange?.(email);
	}, [email, onEmailChange]);

	const handleEmailChange = (value: string) => {
		setEmail(value);
		if (value.trim() !== '') {
			const validation = validateEmail(value);
			setEmailError(validation.isValid ? '' : validation.errorMessage);
		} else {
			setEmailError('');
		}
	};

	const handlePasswordChange = (value: string) => {
		setPassword(value);
		if (value.trim() !== '') {
			const validation = validatePassword(value);
			setPasswordError(validation.isValid ? '' : validation.errorMessage);
		} else {
			setPasswordError('');
		}
	};

	const handleLogin = () => {
		const emailValidation = validateEmail(email);
		if (!emailValidation.isValid) {
			setEmailError(emailValidation.errorMessage);
			return;
		}
		setEmailError('');

		const passwordValidation = validatePassword(password);
		if (!passwordValidation.isValid) {
			setPasswordError(passwordValidation.errorMessage);
			return;
		}
		setPasswordError('');

		signIn({
			email: email.trim().toLowerCase(),
			password,
		});
	};

	return (
		<>
			<View style={{ width: '100%', marginBottom: spacing.sm }}>
				<CInput
					value={email}
					onChangeText={handleEmailChange}
					label="Email"
					placeholder="you@example.com"
					error={emailError}
					keyboardType="email-address"
					autoCapitalize="none"
					autoCorrect={false}
				/>
				<CInput
					value={password}
					onChangeText={handlePasswordChange}
					label="Password"
					placeholder="Enter your password"
					error={passwordError}
					secureTextEntry={!showPassword}
					autoCapitalize="none"
					textContentType="password"
					rightAccessory={
						<TouchableOpacity
							onPress={() => setShowPassword(v => !v)}
							hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
							<IconComp
								name={showPassword ? 'eye-off-outline' : 'eye-outline'}
								size={22}
								color={colors.placeholder}
							/>
						</TouchableOpacity>
					}
				/>
			</View>
			<CButton
				title="Log in"
				onPress={handleLogin}
				disabled={disable}
				loading={isLoading}
				size="lg"
			/>
		</>
	);
};

export default LoginForm;
