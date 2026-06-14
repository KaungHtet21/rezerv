import { API } from '~config/api';
import { API_SERVICE } from '~shared/infrastructure/api/restApi';
import type { BookingNote } from '~domains/scheduling/domain';
import {
	invalidateClassData,
	replaceTempBookingNote,
} from './bookingCache';
import { replaceNoteIdInQueue } from './queueCoalesce';
import { isTempNoteId } from './tempIds';
import type { PendingMutation } from './types';

type NoteResponse = Pick<
	BookingNote,
	'id' | 'content' | 'createdAt' | 'updatedAt'
>;

const toNoteItem = (note: NoteResponse): NoteResponse => ({
	id: note.id,
	content: note.content,
	createdAt:
		typeof note.createdAt === 'string'
			? note.createdAt
			: new Date(note.createdAt).toISOString(),
	updatedAt:
		typeof note.updatedAt === 'string'
			? note.updatedAt
			: new Date(note.updatedAt).toISOString(),
});

const resolveNoteId = (noteId: string, idMap: Record<string, string>) =>
	idMap[noteId] ?? noteId;

export const syncOfflineQueue = async (
	queue: PendingMutation[],
): Promise<{ remainingQueue: PendingMutation[]; affectedClassIds: Set<string> }> => {
	const idMap: Record<string, string> = {};
	let remainingQueue = [...queue];
	const affectedClassIds = new Set<string>();

	while (remainingQueue.length > 0) {
		const mutation = remainingQueue[0];
		affectedClassIds.add(mutation.classId);

		try {
			switch (mutation.type) {
				case 'UPDATE_STATUS':
					await API_SERVICE.patch(API.BOOKINGS.STATUS(mutation.bookingId), {
						status: mutation.status,
					});
					break;

				case 'CREATE_NOTE': {
					const response = await API_SERVICE.post<NoteResponse>(
						API.BOOKINGS.NOTES(mutation.bookingId),
						{ content: mutation.content },
					);
					const serverNote = toNoteItem(response.data);
					idMap[mutation.tempNoteId] = serverNote.id;
					replaceTempBookingNote(
						mutation.classId,
						mutation.bookingId,
						mutation.tempNoteId,
						serverNote,
					);
					remainingQueue = replaceNoteIdInQueue(
						remainingQueue.slice(1),
						mutation.tempNoteId,
						serverNote.id,
					);
					continue;
				}

				case 'UPDATE_NOTE': {
					const noteId = resolveNoteId(mutation.noteId, idMap);
					if (isTempNoteId(noteId)) {
						throw new Error('Temporary note has not synced yet');
					}
					await API_SERVICE.patch(
						API.BOOKINGS.NOTE(mutation.bookingId, noteId),
						{ content: mutation.content },
					);
					break;
				}

				case 'DELETE_NOTE': {
					const noteId = resolveNoteId(mutation.noteId, idMap);
					if (isTempNoteId(noteId)) {
						break;
					}
					await API_SERVICE.delete(
						API.BOOKINGS.NOTE(mutation.bookingId, noteId),
					);
					break;
				}

				case 'RESTORE_NOTE': {
					const noteId = resolveNoteId(mutation.noteId, idMap);
					if (isTempNoteId(noteId)) {
						break;
					}
					await API_SERVICE.post(
						API.BOOKINGS.RESTORE_NOTE(mutation.bookingId, noteId),
						{},
					);
					break;
				}

				default:
					break;
			}

			remainingQueue = remainingQueue.slice(1);
		} catch {
			break;
		}
	}

	for (const classId of affectedClassIds) {
		invalidateClassData(classId);
	}

	return { remainingQueue, affectedClassIds };
};
