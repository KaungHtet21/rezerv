import type { BookingStatus } from '~domains/scheduling/domain';

export type PendingMutation =
	| {
			id: string;
			type: 'UPDATE_STATUS';
			classId: string;
			bookingId: string;
			status: BookingStatus;
			createdAt: number;
	  }
	| {
			id: string;
			type: 'CREATE_NOTE';
			classId: string;
			bookingId: string;
			tempNoteId: string;
			content: string;
			createdAt: number;
	  }
	| {
			id: string;
			type: 'UPDATE_NOTE';
			classId: string;
			bookingId: string;
			noteId: string;
			content: string;
			createdAt: number;
	  }
	| {
			id: string;
			type: 'DELETE_NOTE';
			classId: string;
			bookingId: string;
			noteId: string;
			createdAt: number;
	  }
	| {
			id: string;
			type: 'RESTORE_NOTE';
			classId: string;
			bookingId: string;
			noteId: string;
			content: string;
			createdAt: number;
	  };

export type MutationResult = { queued: boolean };

export type PendingMutationInput =
	| {
			type: 'UPDATE_STATUS';
			classId: string;
			bookingId: string;
			status: BookingStatus;
	  }
	| {
			type: 'CREATE_NOTE';
			classId: string;
			bookingId: string;
			tempNoteId: string;
			content: string;
	  }
	| {
			type: 'UPDATE_NOTE';
			classId: string;
			bookingId: string;
			noteId: string;
			content: string;
	  }
	| {
			type: 'DELETE_NOTE';
			classId: string;
			bookingId: string;
			noteId: string;
	  }
	| {
			type: 'RESTORE_NOTE';
			classId: string;
			bookingId: string;
			noteId: string;
			content: string;
	  };
