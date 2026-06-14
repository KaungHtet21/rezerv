import type { Booking, BookingStatus } from '~core/server/apis/classes';
import { queryClient } from '~core/server/queryClient';
import { queryKeys } from '~core/server/queryKeys';

type NoteItem = Booking['notes'][number];

const getBookings = (classId: string) =>
	queryClient.getQueryData<Booking[]>(queryKeys.classBookings(classId));

const setBookings = (classId: string, updater: (bookings: Booking[]) => Booking[]) => {
	const current = getBookings(classId) ?? [];
	queryClient.setQueryData<Booking[]>(queryKeys.classBookings(classId), updater(current));
};

const patchBooking = (
	classId: string,
	bookingId: string,
	updater: (booking: Booking) => Booking,
) => {
	setBookings(classId, bookings =>
		bookings.map(booking => (booking.id === bookingId ? updater(booking) : booking)),
	);
};

export const patchBookingStatus = (
	classId: string,
	bookingId: string,
	status: BookingStatus,
) => {
	patchBooking(classId, bookingId, booking => ({ ...booking, status }));
};

export const addBookingNote = (
	classId: string,
	bookingId: string,
	note: NoteItem,
) => {
	patchBooking(classId, bookingId, booking => ({
		...booking,
		notes: [note, ...booking.notes],
	}));
};

export const updateBookingNoteContent = (
	classId: string,
	bookingId: string,
	noteId: string,
	content: string,
) => {
	patchBooking(classId, bookingId, booking => ({
		...booking,
		notes: booking.notes.map(note =>
			note.id === noteId
				? { ...note, content, updatedAt: new Date().toISOString() }
				: note,
		),
	}));
};

export const removeBookingNote = (
	classId: string,
	bookingId: string,
	noteId: string,
) => {
	patchBooking(classId, bookingId, booking => ({
		...booking,
		notes: booking.notes.filter(note => note.id !== noteId),
	}));
};

export const replaceTempBookingNote = (
	classId: string,
	bookingId: string,
	tempNoteId: string,
	serverNote: NoteItem,
) => {
	patchBooking(classId, bookingId, booking => ({
		...booking,
		notes: booking.notes.map(note => (note.id === tempNoteId ? serverNote : note)),
	}));
};

export const restoreBookingNote = (
	classId: string,
	bookingId: string,
	note: NoteItem,
) => {
	patchBooking(classId, bookingId, booking => {
		if (booking.notes.some(existing => existing.id === note.id)) {
			return booking;
		}
		return {
			...booking,
			notes: [note, ...booking.notes],
		};
	});
};

export const invalidateClassData = (classId: string) => {
	queryClient.invalidateQueries(queryKeys.classBookings(classId));
	queryClient.invalidateQueries(['classes', 'by-date']);
};
