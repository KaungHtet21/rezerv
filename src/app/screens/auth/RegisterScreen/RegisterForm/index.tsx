import React, { useCallback, useRef, useState } from 'react';
import { Alert, View, TouchableOpacity } from 'react-native';
import { CInput, CButton, IconComp } from '~app/common';
import { spacing, useColors } from '~core/design';
import { validateEmail, validatePassword } from '~core/utils/validation';
import { registerRequest } from '~core/server/apis/auth';
import { useAppDispatch } from '~core/store/hooks';
import { loginData } from '~core/store/slices/userSlice';

const DEBOUNCE_MS = 800;

const RegisterForm = () => {
	const dispatch = useAppDispatch();
	const colors = useColors();
	const [email, setEmail] = useState('');
	const [emailError, setEmailError] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [confirmPasswordError, setConfirmPasswordError] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [loading, setLoading] = useState(false);

	const emailTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const passwordTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const confirmTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const passwordRef = useRef(password);
	const confirmRef = useRef(confirmPassword);

	const isDisabled = !email || !password || !confirmPassword || loading;

	const handleEmailChange = useCallback(
		(value: string) => {
			const lower = value.toLowerCase();
			setEmail(lower);
			if (emailError) setEmailError('');
			if (emailTimer.current) clearTimeout(emailTimer.current);
			if (value.trim().length < 3) return;
			emailTimer.current = setTimeout(() => {
				const result = validateEmail(value);
				if (!result.isValid) setEmailError(result.errorMessage);
			}, DEBOUNCE_MS);
		},
		[emailError],
	);

	const handlePasswordChange = useCallback(
		(value: string) => {
			setPassword(value);
			passwordRef.current = value;
			if (passwordError) setPasswordError('');
			if (passwordTimer.current) clearTimeout(passwordTimer.current);
			if (!value) return;
			passwordTimer.current = setTimeout(() => {
				const result = validatePassword(value);
				if (!result.isValid) setPasswordError(result.errorMessage);
			}, DEBOUNCE_MS);
		},
		[passwordError],
	);

	const handleConfirmPasswordChange = useCallback(
		(value: string) => {
			setConfirmPassword(value);
			confirmRef.current = value;
			if (confirmPasswordError) setConfirmPasswordError('');
			if (confirmTimer.current) clearTimeout(confirmTimer.current);
			if (!value) return;
			confirmTimer.current = setTimeout(() => {
				if (passwordRef.current !== value) {
					setConfirmPasswordError('Passwords do not match');
				}
			}, DEBOUNCE_MS);
		},
		[confirmPasswordError],
	);

	const handleRegister = async () => {
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

		if (password !== confirmPassword) {
			setConfirmPasswordError('Passwords do not match');
			return;
		}
		setConfirmPasswordError('');

		const trimmedEmail = email.trim().toLowerCase();

		try {
			setLoading(true);
			const response = await registerRequest({
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

			Alert.alert(response?.message || 'Registration failed');
		} catch (error: any) {
			const msg =
				error?.response?.data?.message ||
				error?.message ||
				'Registration failed. Check your connection and try again.';
			Alert.alert(msg);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<View style={{ width: '100%', marginBottom: spacing.xxl }}>
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
					placeholder="Create a password"
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
				<CInput
					value={confirmPassword}
					onChangeText={handleConfirmPasswordChange}
					label="Confirm password"
					placeholder="Re-enter your password"
					error={confirmPasswordError}
					secureTextEntry={!showConfirmPassword}
					autoCapitalize="none"
					textContentType="password"
					rightAccessory={
						<TouchableOpacity
							onPress={() => setShowConfirmPassword(v => !v)}
							hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
							<IconComp
								name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
								size={22}
								color={colors.placeholder}
							/>
						</TouchableOpacity>
					}
				/>
			</View>
			<CButton
				title="Create account"
				onPress={handleRegister}
				disabled={isDisabled}
				loading={loading}
				size="lg"
			/>
		</>
	);
};

export default RegisterForm;
