export const validateEmail = (
	email: string,
): { isValid: boolean; errorMessage: string } => {
	if (!email || email.trim() === '') {
		return { isValid: false, errorMessage: 'Email is required' };
	}

	const trimmedEmail = email.trim();
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	if (!emailRegex.test(trimmedEmail)) {
		return { isValid: false, errorMessage: 'Please enter a valid email address' };
	}

	return { isValid: true, errorMessage: '' };
};

export const validatePassword = (
	password: string,
): { isValid: boolean; errorMessage: string } => {
	if (password.length < 8) {
		return { isValid: false, errorMessage: 'Password must be at least 8 characters.' };
	}

	if (password.length > 30) {
		return { isValid: false, errorMessage: 'Password must be 30 characters or less.' };
	}

	if (!/[a-zA-Z]/.test(password)) {
		return { isValid: false, errorMessage: 'Password must include at least one letter.' };
	}

	if (!/[0-9]/.test(password)) {
		return { isValid: false, errorMessage: 'Password must include at least one number.' };
	}

	return { isValid: true, errorMessage: '' };
};
