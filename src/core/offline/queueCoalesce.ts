import type { PendingMutation, PendingMutationInput } from './types';
import { isTempNoteId } from './tempIds';

const createMutationId = () =>
	`mutation-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const enqueueMutation = (
	queue: PendingMutation[],
	mutation: PendingMutationInput,
): PendingMutation[] => {
	const next = [...queue];
	const createdAt = Date.now();
	const withMeta = { ...mutation, id: createMutationId(), createdAt } as PendingMutation;

	switch (withMeta.type) {
		case 'UPDATE_STATUS': {
			const existingIndex = next.findIndex(
				item =>
					item.type === 'UPDATE_STATUS' &&
					item.bookingId === withMeta.bookingId &&
					item.classId === withMeta.classId,
			);
			if (existingIndex >= 0) {
				next[existingIndex] = {
					...next[existingIndex],
					status: withMeta.status,
					createdAt,
				} as PendingMutation;
				return next;
			}
			return [...next, withMeta];
		}

		case 'CREATE_NOTE': {
			return [...next, withMeta];
		}

		case 'UPDATE_NOTE': {
			if (isTempNoteId(withMeta.noteId)) {
				const createIndex = next.findIndex(
					item =>
						item.type === 'CREATE_NOTE' &&
						item.tempNoteId === withMeta.noteId &&
						item.bookingId === withMeta.bookingId,
				);
				if (createIndex >= 0) {
					const createItem = next[createIndex];
					if (createItem.type === 'CREATE_NOTE') {
						next[createIndex] = {
							...createItem,
							content: withMeta.content,
							createdAt,
						};
						return next;
					}
				}
			}

			const updateIndex = next.findIndex(
				item =>
					item.type === 'UPDATE_NOTE' &&
					item.noteId === withMeta.noteId &&
					item.bookingId === withMeta.bookingId,
			);
			if (updateIndex >= 0) {
				next[updateIndex] = {
					...next[updateIndex],
					content: withMeta.content,
					createdAt,
				} as PendingMutation;
				return next;
			}

			return [...next, withMeta];
		}

		case 'DELETE_NOTE': {
			if (isTempNoteId(withMeta.noteId)) {
				return next.filter(item => {
					if (item.bookingId !== withMeta.bookingId) return true;
					if (item.type === 'CREATE_NOTE' && item.tempNoteId === withMeta.noteId) {
						return false;
					}
					if (
						item.type === 'UPDATE_NOTE' &&
						item.noteId === withMeta.noteId
					) {
						return false;
					}
					return true;
				});
			}

			const withoutPendingRestore = next.filter(
				item =>
					!(
						item.type === 'RESTORE_NOTE' &&
						item.noteId === withMeta.noteId &&
						item.bookingId === withMeta.bookingId
					),
			);

			const existingDelete = withoutPendingRestore.find(
				item =>
					item.type === 'DELETE_NOTE' &&
					item.noteId === withMeta.noteId &&
					item.bookingId === withMeta.bookingId,
			);
			if (existingDelete) {
				return withoutPendingRestore;
			}

			return [...withoutPendingRestore, withMeta];
		}

		case 'RESTORE_NOTE': {
			const withoutPendingDelete = next.filter(
				item =>
					!(
						item.type === 'DELETE_NOTE' &&
						item.noteId === withMeta.noteId &&
						item.bookingId === withMeta.bookingId
					),
			);
			const existingRestore = withoutPendingDelete.find(
				item =>
					item.type === 'RESTORE_NOTE' &&
					item.noteId === withMeta.noteId &&
					item.bookingId === withMeta.bookingId,
			);
			if (existingRestore) {
				return withoutPendingDelete;
			}
			return [...withoutPendingDelete, withMeta];
		}

		default:
			return [...next, withMeta];
	}
};

export const replaceNoteIdInQueue = (
	queue: PendingMutation[],
	tempNoteId: string,
	realNoteId: string,
) =>
	queue.map(item => {
		if ('noteId' in item && item.noteId === tempNoteId) {
			return { ...item, noteId: realNoteId };
		}
		return item;
	});
