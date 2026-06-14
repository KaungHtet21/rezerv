export const SERVER = {
	API_URL: 'https://rezerv-api.onrender.com',
};

export const API = {
	AUTH: {
		SIGNIN: '/auth/signin',
		SIGNUP: '/auth/signup',
		VERIFY_EMAIL: '/auth/verify-email',
		RESEND_VERIFICATION: '/auth/resend-verification',
	},
	CLASSES: {
		TODAY: '/classes/today',
		BY_ID: (id: string) => `/classes/${id}`,
	},
	BOOKINGS: {
		BY_CLASS: (classId: string) => `/classes/${classId}/bookings`,
		BY_ID: (id: string) => `/bookings/${id}`,
		STATUS: (id: string) => `/bookings/${id}/status`,
		NOTES: (bookingId: string) => `/bookings/${bookingId}/notes`,
		NOTE: (bookingId: string, noteId: string) =>
			`/bookings/${bookingId}/notes/${noteId}`,
		RESTORE_NOTE: (bookingId: string, noteId: string) =>
			`/bookings/${bookingId}/notes/${noteId}/restore`,
	},
};
