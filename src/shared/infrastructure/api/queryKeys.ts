export const queryKeys = {
	classesByDate: (date: string) => ['classes', 'by-date', date] as const,
	classBookings: (classId: string) => ['classes', classId, 'bookings'] as const,
	bookingNotes: (bookingId: string) => ['bookings', bookingId, 'notes'] as const,
};
