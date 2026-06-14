export const TEMP_NOTE_PREFIX = 'offline-';

export const isTempNoteId = (noteId: string) => noteId.startsWith(TEMP_NOTE_PREFIX);

export const createTempNoteId = () =>
	`${TEMP_NOTE_PREFIX}${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
