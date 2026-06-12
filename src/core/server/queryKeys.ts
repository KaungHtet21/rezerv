export const queryKeys = {
	classesToday: ['classes', 'today'] as const,
	classBookings: (classId: string) => ['classes', classId, 'bookings'] as const,
	bookingNotes: (bookingId: string) => ['bookings', bookingId, 'notes'] as const,
};
