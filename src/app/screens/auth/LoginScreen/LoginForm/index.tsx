import React, { useEffect, useState } from 'react';
import { Alert, View, TouchableOpacity } from 'react-native';
import { CInput, CButton, IconComp } from '~app/common';
import { spacing, useColors } from '~core/design';
import { validateEmail, validatePassword } from '~core/utils/validation';
import { loginRequest } from '~core/server/apis/auth';
import { useAppDispatch } from '~core/store/hooks';
import { loginData } from '~core/store/slices/userSlice';

type Props = {
	prefillEmail?: string;
	onEmailChange?: (email: string) => void;
};

const LoginForm = ({ prefillEmail = '', onEmailChange }: Props) => {
	const dispatch = useAppDispatch();
	const colors = useColors();
	const [email, setEmail] = useState(prefillEmail);
	const [emailError, setEmailError] = useState('');
	const [password, setPassword] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);

	const disable = !email || !password || loading;

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

	const handleLogin = async () => {
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

		const trimmedEmail = email.trim().toLowerCase();

		try {
			setLoading(true);
			const response = await loginRequest({
				email: trimmedEmail,
				password,
			});

			if (response?.success && response.access_token && response.user) {
				dispatch(
					loginData({
						access_token: response.access_token,
						user: response.user,
					}),
				);
				return;
			}

			Alert.alert(response?.message || 'Login failed');
		} catch (error: any) {
			const msg =
				error?.response?.data?.message ||
				error?.message ||
				'Login failed. Check your connection and try again.';
			Alert.alert(msg);
		} finally {
			setLoading(false);
		}
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
				loading={loading}
				size="lg"
			/>
		</>
	);
};

export default LoginForm;
