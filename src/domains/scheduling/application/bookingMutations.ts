import { useMutation } from 'react-query';
import { API } from '~config/api';
import type { Booking, BookingStatus, ClassSummary } from '../domain';
import { useApiQuery } from '~shared/infrastructure/api/api-fetch';
import { queryClient } from '~shared/infrastructure/api/queryClient';
import { queryKeys } from '~shared/infrastructure/api/queryKeys';
import { API_SERVICE } from '~shared/infrastructure/api/restApi';
import store from '~shared/infrastructure/state/store';
import { offlineInitialState } from '~shared/infrastructure/state/slices/offlineState';
import { queueOfflineMutation, reapplyOfflineQueueToCache } from '~shared/infrastructure/offline/offlineActions';
import {
	addBookingNote,
	invalidateClassData,
	patchBookingStatus,
	removeBookingNote,
	restoreBookingNote,
	updateBookingNoteContent,
} from '~shared/infrastructure/offline/bookingCache';
import { isNetworkError } from '~shared/infrastructure/offline/network';
import { createTempNoteId } from '~shared/infrastructure/offline/tempIds';
import type { MutationResult, PendingMutationInput } from '~shared/infrastructure/offline/types';

const isOnline = () =>
	(store.getState().offline ?? offlineInitialState).isOnline === true;

const queueOrThrow = (payload: PendingMutationInput, error: unknown) => {
	if (isNetworkError(error) || !isOnline()) {
		queueOfflineMutation(payload);
		return { queued: true } satisfies MutationResult;
	}
	throw error;
};

export const useClassesByDate = (date: string) =>
	useApiQuery<ClassSummary[]>({
		url: API.CLASSES.TODAY,
		params: { date },
		queryKey: queryKeys.classesByDate(date),
		enabled: Boolean(date),
		staleTime: 30_000,
	});

export const useClassBookings = (classId: string) =>
	useApiQuery<Booking[]>({
		url: API.BOOKINGS.BY_CLASS(classId),
		queryKey: queryKeys.classBookings(classId),
		enabled: Boolean(classId),
		onSuccess: () => {
			reapplyOfflineQueueToCache();
		},
	});

export const useUpdateBookingStatus = (classId: string) =>
	useMutation<
		MutationResult,
		unknown,
		{ bookingId: string; status: BookingStatus },
		{ previous?: Booking[] }
	>({
		onMutate: async ({ bookingId, status }) => {
			await queryClient.cancelQueries(queryKeys.classBookings(classId));
			const previous = queryClient.getQueryData<Booking[]>(
				queryKeys.classBookings(classId),
			);
			patchBookingStatus(classId, bookingId, status);
			return { previous };
		},
		mutationFn: async ({ bookingId, status }) => {
			if (!isOnline()) {
				queueOfflineMutation({
					type: 'UPDATE_STATUS',
					classId,
					bookingId,
					status,
				});
				return { queued: true };
			}

			try {
				await API_SERVICE.patch(API.BOOKINGS.STATUS(bookingId), { status });
				return { queued: false };
			} catch (error) {
				return queueOrThrow(
					{
						type: 'UPDATE_STATUS',
						classId,
						bookingId,
						status,
					},
					error,
				);
			}
		},
		onSuccess: result => {
			if (!result.queued) {
				invalidateClassData(classId);
			}
		},
		onError: (_error, _variables, context) => {
			if (context?.previous) {
				queryClient.setQueryData(
					queryKeys.classBookings(classId),
					context.previous,
				);
			}
		},
	});

export const useCreateBookingNote = (classId: string, bookingId: string) => {
	const mutation = useMutation<
		MutationResult,
		unknown,
		{ content: string; tempNoteId: string },
		{ previous?: Booking[] }
	>({
		onMutate: async ({ content, tempNoteId }) => {
			await queryClient.cancelQueries(queryKeys.classBookings(classId));
			const previous = queryClient.getQueryData<Booking[]>(
				queryKeys.classBookings(classId),
			);
			const now = new Date().toISOString();
			addBookingNote(classId, bookingId, {
				id: tempNoteId,
				content,
				createdAt: now,
				updatedAt: now,
			});
			return { previous };
		},
		mutationFn: async ({ content, tempNoteId }) => {
			if (!isOnline()) {
				queueOfflineMutation({
					type: 'CREATE_NOTE',
					classId,
					bookingId,
					tempNoteId,
					content,
				});
				return { queued: true };
			}

			try {
				await API_SERVICE.post(API.BOOKINGS.NOTES(bookingId), { content });
				return { queued: false };
			} catch (error) {
				return queueOrThrow(
					{
						type: 'CREATE_NOTE',
						classId,
						bookingId,
						tempNoteId,
						content,
					},
					error,
				);
			}
		},
		onSuccess: result => {
			if (!result.queued) {
				invalidateClassData(classId);
			}
		},
		onError: (_error, _variables, context) => {
			if (context?.previous) {
				queryClient.setQueryData(
					queryKeys.classBookings(classId),
					context.previous,
				);
			}
		},
	});

	return {
		...mutation,
		mutate: (
			content: string,
			options?: Parameters<typeof mutation.mutate>[1],
		) => {
			mutation.mutate(
				{ content, tempNoteId: createTempNoteId() },
				options,
			);
		},
		mutateAsync: (content: string) =>
			mutation.mutateAsync({
				content,
				tempNoteId: createTempNoteId(),
			}),
	};
};

export const useUpdateBookingNote = (classId: string, bookingId: string) =>
	useMutation<
		MutationResult,
		unknown,
		{ noteId: string; content: string },
		{ previous?: Booking[] }
	>({
		onMutate: async ({ noteId, content }) => {
			await queryClient.cancelQueries(queryKeys.classBookings(classId));
			const previous = queryClient.getQueryData<Booking[]>(
				queryKeys.classBookings(classId),
			);
			updateBookingNoteContent(classId, bookingId, noteId, content);
			return { previous };
		},
		mutationFn: async ({ noteId, content }) => {
			if (!isOnline()) {
				queueOfflineMutation({
					type: 'UPDATE_NOTE',
					classId,
					bookingId,
					noteId,
					content,
				});
				return { queued: true };
			}

			try {
				await API_SERVICE.patch(API.BOOKINGS.NOTE(bookingId, noteId), {
					content,
				});
				return { queued: false };
			} catch (error) {
				return queueOrThrow(
					{
						type: 'UPDATE_NOTE',
						classId,
						bookingId,
						noteId,
						content,
					},
					error,
				);
			}
		},
		onSuccess: result => {
			if (!result.queued) {
				invalidateClassData(classId);
			}
		},
		onError: (_error, _variables, context) => {
			if (context?.previous) {
				queryClient.setQueryData(
					queryKeys.classBookings(classId),
					context.previous,
				);
			}
		},
	});

export const useDeleteBookingNote = (classId: string, bookingId: string) =>
	useMutation<
		MutationResult,
		unknown,
		string,
		{ previous?: Booking[]; deletedContent?: string }
	>({
		onMutate: async noteId => {
			await queryClient.cancelQueries(queryKeys.classBookings(classId));
			const previous = queryClient.getQueryData<Booking[]>(
				queryKeys.classBookings(classId),
			);
			const deletedContent = previous
				?.find(booking => booking.id === bookingId)
				?.notes.find(note => note.id === noteId)?.content;
			removeBookingNote(classId, bookingId, noteId);
			return { previous, deletedContent };
		},
		mutationFn: async noteId => {
			if (!isOnline()) {
				queueOfflineMutation({
					type: 'DELETE_NOTE',
					classId,
					bookingId,
					noteId,
				});
				return { queued: true };
			}

			try {
				await API_SERVICE.delete(API.BOOKINGS.NOTE(bookingId, noteId));
				return { queued: false };
			} catch (error) {
				return queueOrThrow(
					{
						type: 'DELETE_NOTE',
						classId,
						bookingId,
						noteId,
					},
					error,
				);
			}
		},
		onSuccess: result => {
			if (!result.queued) {
				invalidateClassData(classId);
			}
		},
		onError: (_error, _noteId, context) => {
			if (context?.previous) {
				queryClient.setQueryData(
					queryKeys.classBookings(classId),
					context.previous,
				);
			}
		},
	});

export const useRestoreBookingNote = (classId: string) =>
	useMutation<
		MutationResult,
		unknown,
		{ bookingId: string; noteId: string; content: string },
		{ previous?: Booking[] }
	>({
		onMutate: async ({ bookingId, noteId, content }) => {
			await queryClient.cancelQueries(queryKeys.classBookings(classId));
			const previous = queryClient.getQueryData<Booking[]>(
				queryKeys.classBookings(classId),
			);
			const now = new Date().toISOString();
			restoreBookingNote(classId, bookingId, {
				id: noteId,
				content,
				createdAt: now,
				updatedAt: now,
			});
			return { previous };
		},
		mutationFn: async ({ bookingId, noteId, content }) => {
			if (!isOnline()) {
				queueOfflineMutation({
					type: 'RESTORE_NOTE',
					classId,
					bookingId,
					noteId,
					content,
				});
				return { queued: true };
			}

			try {
				await API_SERVICE.post(
					API.BOOKINGS.RESTORE_NOTE(bookingId, noteId),
					{},
				);
				return { queued: false };
			} catch (error) {
				return queueOrThrow(
					{
						type: 'RESTORE_NOTE',
						classId,
						bookingId,
						noteId,
						content,
					},
					error,
				);
			}
		},
		onSuccess: result => {
			if (!result.queued) {
				invalidateClassData(classId);
			}
		},
		onError: (_error, _variables, context) => {
			if (context?.previous) {
				queryClient.setQueryData(
					queryKeys.classBookings(classId),
					context.previous,
				);
			}
		},
	});
