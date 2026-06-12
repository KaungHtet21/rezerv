export type BookingStatus = 'SCHEDULED' | 'ATTENDED' | 'NO_SHOW' | 'CANCELLED';

export type ClassSummary = {
	id: string;
	name: string;
	instructor: string;
	startsAt: string;
	endsAt: string;
	timeLabel: string;
	capacity: number;
	attendeeCount: number;
	attendanceLabel: string;
	createdAt: string;
	updatedAt: string;
};

export type BookingNote = {
	id: string;
	bookingId: string;
	authorId: string;
	content: string;
	deletedAt: string | null;
	createdAt: string;
	updatedAt: string;
};

export type Booking = {
	id: string;
	classId: string;
	attendeeName: string;
	attendeeEmail: string | null;
	status: BookingStatus;
	notes: Pick<BookingNote, 'id' | 'content' | 'createdAt' | 'updatedAt'>[];
	createdAt: string;
	updatedAt: string;
};

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
	SCHEDULED: 'Scheduled',
	ATTENDED: 'Attended',
	NO_SHOW: 'No-show',
	CANCELLED: 'Cancelled',
};

export const ATTENDANCE_STATUSES: BookingStatus[] = [
	'ATTENDED',
	'NO_SHOW',
	'CANCELLED',
];
