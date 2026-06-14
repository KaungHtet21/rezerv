import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Alert, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CInput, CButton, CDropdownInput, IconComp } from '~shared/presentation/ui';
import { GenderOption, GENDER_OPTIONS } from '~config/gender';
import { useGlobalBottomSheet } from '~shared/presentation/layouts';
import {
	CountryPickerModal,
	DEFAULT_COUNTRY_CODE,
	GenderPickerSheet,
	DateOfBirthPickerSheet,
	getCountryName,
	type CountryCode,
} from '~domains/auth/presentation/sheets';
import { spacing, useColors } from '~shared/presentation/design';
import { formatDateLabel } from '~shared/utils/date';
import { validateEmail, validatePassword } from '~shared/utils/validation';
import { useSignUp } from '~domains/auth/application/authMutations';
import { getApiErrorMessage } from '~shared/domain/errors';
import type { Gender } from '~domains/auth/domain';

const DEBOUNCE_MS = 800;

const RegisterForm = () => {
	const navigation = useNavigation<any>();
	const colors = useColors();
	const { openSheet, closeSheet } = useGlobalBottomSheet();
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [gender, setGender] = useState<GenderOption>(GenderOption.PREFER_NOT_TO_SAY);
	const [dob, setDob] = useState('');
	const [country, setCountry] = useState('');
	const [countryCode, setCountryCode] =
		useState<CountryCode>(DEFAULT_COUNTRY_CODE);
	const [countryPickerVisible, setCountryPickerVisible] = useState(false);
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

	const selectedGender = useMemo(
		() => GENDER_OPTIONS.find(option => option.value === gender),
		[gender],
	);

	const selectedDob = useMemo(
		() => (dob ? { label: formatDateLabel(dob) } : undefined),
		[dob],
	);

	const selectedCountry = useMemo(
		() => (country ? { label: country } : undefined),
		[country],
	);

	const handleOpenGenderSheet = useCallback(() => {
		openSheet(
			<GenderPickerSheet
				selected={gender}
				onSelect={(value: GenderOption) => {
					setGender(value);
					closeSheet();
				}}
			/>,
		);
	}, [closeSheet, gender, openSheet]);

	const handleOpenDobSheet = useCallback(() => {
		openSheet(
			<DateOfBirthPickerSheet
				value={dob}
				onConfirm={(value: string) => {
					setDob(value);
					closeSheet();
				}}
			/>,
			{ snapPoint: '45%' },
		);
	}, [closeSheet, dob, openSheet]);

	const handleOpenCountryPicker = useCallback(() => {
		setCountryPickerVisible(true);
	}, []);

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

		signUp({
			email: email.trim().toLowerCase(),
			phone: phone.trim(),
			name: name.trim(),
			gender: gender as Gender,
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
				<CDropdownInput
					label="Gender"
					placeholder="Select gender"
					value={selectedGender}
					valueKey="label"
					onOpen={handleOpenGenderSheet}
				/>
				<CDropdownInput
					label="Date of birth"
					placeholder="Select date of birth"
					value={selectedDob}
					valueKey="label"
					onOpen={handleOpenDobSheet}
				/>
				<CDropdownInput
					label="Country"
					placeholder="Select country"
					value={selectedCountry}
					valueKey="label"
					onOpen={handleOpenCountryPicker}
				/>
				<CInput
					value={address}
					onChangeText={setAddress}
					label="Address"
					placeholder="123 Main St, Springfield"
					autoCapitalize="words"
					multiline
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
				style={{ marginBottom: spacing.md }}
			/>
			<CountryPickerModal
				visible={countryPickerVisible}
				countryCode={countryCode}
				onSelect={selected => {
					setCountryCode(selected.cca2);
					setCountry(getCountryName(selected));
					setCountryPickerVisible(false);
				}}
				onClose={() => setCountryPickerVisible(false)}
			/>
		</>
	);
};

export default RegisterForm;
