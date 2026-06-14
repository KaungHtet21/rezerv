import type { Booking } from '~core/server/apis/classes';
import { queryClient } from '~core/server/queryClient';
import { queryKeys } from '~core/server/queryKeys';
import type { PendingMutation } from './types';
import {
	addBookingNote,
	patchBookingStatus,
	removeBookingNote,
	restoreBookingNote,
	updateBookingNoteContent,
} from './bookingCache';

export const applyOfflineQueueToCache = (queue: PendingMutation[]) => {
	for (const mutation of queue) {
		switch (mutation.type) {
			case 'UPDATE_STATUS':
				patchBookingStatus(
					mutation.classId,
					mutation.bookingId,
					mutation.status,
				);
				break;

			case 'CREATE_NOTE': {
				const bookings = queryClient.getQueryData<Booking[]>(
					queryKeys.classBookings(mutation.classId),
				);
				const booking = bookings?.find(item => item.id === mutation.bookingId);
				if (booking?.notes.some(note => note.id === mutation.tempNoteId)) {
					break;
				}

				const now = new Date(mutation.createdAt).toISOString();
				addBookingNote(mutation.classId, mutation.bookingId, {
					id: mutation.tempNoteId,
					content: mutation.content,
					createdAt: now,
					updatedAt: now,
				});
				break;
			}

			case 'UPDATE_NOTE':
				updateBookingNoteContent(
					mutation.classId,
					mutation.bookingId,
					mutation.noteId,
					mutation.content,
				);
				break;

			case 'DELETE_NOTE':
				removeBookingNote(
					mutation.classId,
					mutation.bookingId,
					mutation.noteId,
				);
				break;

			case 'RESTORE_NOTE': {
				const now = new Date(mutation.createdAt).toISOString();
				restoreBookingNote(mutation.classId, mutation.bookingId, {
					id: mutation.noteId,
					content: mutation.content,
					createdAt: now,
					updatedAt: now,
				});
				break;
			}

			default:
				break;
		}
	}
};
