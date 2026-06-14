export const getApiErrorMessage = (error: unknown, fallback: string): string => {
	const err = error as { response?: { data?: { message?: string | string[] } }; message?: string };
	const message = err?.response?.data?.message;
	if (Array.isArray(message)) {
		return message.join(', ');
	}
	if (typeof message === 'string') {
		return message;
	}
	return err?.message || fallback;
};
