import React, { useCallback, useRef, useState } from 'react';
import { Alert, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CInput, CButton, IconComp } from '~app/common';
import { spacing, useColors } from '~core/design';
import { validateEmail, validatePassword } from '~core/utils/validation';
import { useSignUp } from '~core/server/api-fetch';
import { GENDERS, getApiErrorMessage, type Gender } from '~core/server/apis/auth';

const DEBOUNCE_MS = 800;

const RegisterForm = () => {
	const navigation = useNavigation<any>();
	const colors = useColors();
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [gender, setGender] = useState('PREFER_NOT_TO_SAY');
	const [dob, setDob] = useState('');
	const [country, setCountry] = useState('');
	const [address, setAddress] = useState('');
	const [emailError, setEmailError] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [confirmPasswordError, setConfirmPasswordError] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const emailTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const passwordTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const confirmTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const passwordRef = useRef(password);
	const confirmRef = useRef(confirmPassword);

	const { mutate: signUp, isLoading } = useSignUp({
		onSuccess: data => {
			Alert.alert('Account created', data.message, [
				{
					text: 'Verify email',
					onPress: () =>
						navigation.navigate('VerifyEmailScreen', {
							email: email.trim().toLowerCase(),
						}),
				},
			]);
		},
		onError: error => {
			Alert.alert(getApiErrorMessage(error, 'Registration failed. Try again.'));
		},
	});

	const isDisabled =
		!name ||
		!email ||
		!phone ||
		!dob ||
		!country ||
		!address ||
		!password ||
		!confirmPassword ||
		isLoading;

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

	const handleRegister = () => {
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

		const normalizedGender = gender.trim().toUpperCase() as Gender;
		if (!GENDERS.includes(normalizedGender)) {
			Alert.alert(
				'Invalid gender',
				'Use one of: MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY',
			);
			return;
		}

		signUp({
			email: email.trim().toLowerCase(),
			phone: phone.trim(),
			name: name.trim(),
			gender: normalizedGender,
			dob: dob.trim(),
			country: country.trim(),
			address: address.trim(),
			password,
		});
	};

	return (
		<>
			<View style={{ width: '100%', marginBottom: spacing.xxl }}>
				<CInput
					value={name}
					onChangeText={setName}
					label="Full name"
					placeholder="Jane Doe"
					autoCapitalize="words"
				/>
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
					value={phone}
					onChangeText={setPhone}
					label="Phone"
					placeholder="+15551234567"
					keyboardType="phone-pad"
				/>
				<CInput
					value={gender}
					onChangeText={setGender}
					label="Gender"
					placeholder="MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY"
					autoCapitalize="characters"
				/>
				<CInput
					value={dob}
					onChangeText={setDob}
					label="Date of birth"
					placeholder="1995-06-15"
					autoCapitalize="none"
				/>
				<CInput
					value={country}
					onChangeText={setCountry}
					label="Country"
					placeholder="United States"
					autoCapitalize="words"
				/>
				<CInput
					value={address}
					onChangeText={setAddress}
					label="Address"
					placeholder="123 Main St, Springfield"
					autoCapitalize="words"
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
				loading={isLoading}
				size="lg"
			/>
		</>
	);
};

export default RegisterForm;
