import { useMutation, useQuery } from 'react-query';
import { API } from '~constants/api';
import type { Booking, BookingNote, BookingStatus, ClassSummary } from './apis/classes';
import { API_SERVICE } from './restApi';
import { queryClient } from './queryClient';
import { queryKeys } from './queryKeys';

export const useTodayClasses = () =>
	useQuery<ClassSummary[]>(
		queryKeys.classesToday,
		async () => {
			const res = await API_SERVICE.get(API.CLASSES.TODAY);
			return res.data;
		},
		{ staleTime: 30_000 },
	);

export const useClassBookings = (classId: string) =>
	useQuery<Booking[]>(
		queryKeys.classBookings(classId),
		async () => {
			const res = await API_SERVICE.get(API.BOOKINGS.BY_CLASS(classId));
			return res.data;
		},
		{ enabled: Boolean(classId) },
	);

export const useUpdateBookingStatus = (classId: string) =>
	useMutation(
		async ({
			bookingId,
			status,
		}: {
			bookingId: string;
			status: BookingStatus;
		}) => {
			const res = await API_SERVICE.patch(API.BOOKINGS.STATUS(bookingId), {
				status,
			});
			return res.data as Booking;
		},
		{
			onMutate: async ({ bookingId, status }) => {
				await queryClient.cancelQueries(queryKeys.classBookings(classId));
				const previous = queryClient.getQueryData<Booking[]>(
					queryKeys.classBookings(classId),
				);

				queryClient.setQueryData<Booking[]>(
					queryKeys.classBookings(classId),
					old =>
						old?.map(booking =>
							booking.id === bookingId ? { ...booking, status } : booking,
						) ?? [],
				);

				return { previous };
			},
			onError: (_error, _variables, context) => {
				if (context?.previous) {
					queryClient.setQueryData(
						queryKeys.classBookings(classId),
						context.previous,
					);
				}
			},
			onSettled: () => {
				queryClient.invalidateQueries(queryKeys.classBookings(classId));
				queryClient.invalidateQueries(queryKeys.classesToday);
			},
		},
	);

export const useCreateBookingNote = (classId: string, bookingId: string) =>
	useMutation(
		async (content: string) => {
			const res = await API_SERVICE.post(API.BOOKINGS.NOTES(bookingId), {
				content,
			});
			return res.data as BookingNote;
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries(queryKeys.classBookings(classId));
			},
		},
	);

export const useUpdateBookingNote = (classId: string, bookingId: string) =>
	useMutation(
		async ({ noteId, content }: { noteId: string; content: string }) => {
			const res = await API_SERVICE.patch(
				API.BOOKINGS.NOTE(bookingId, noteId),
				{ content },
			);
			return res.data as BookingNote;
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries(queryKeys.classBookings(classId));
			},
		},
	);

export const useDeleteBookingNote = (classId: string, bookingId: string) =>
	useMutation(
		async (noteId: string) => {
			const res = await API_SERVICE.delete(
				API.BOOKINGS.NOTE(bookingId, noteId),
			);
			return res.data as { note: BookingNote; undoAvailable: boolean };
		},
		{
			onMutate: async noteId => {
				await queryClient.cancelQueries(queryKeys.classBookings(classId));
				const previous = queryClient.getQueryData<Booking[]>(
					queryKeys.classBookings(classId),
				);

				queryClient.setQueryData<Booking[]>(
					queryKeys.classBookings(classId),
					old =>
						old?.map(booking =>
							booking.id === bookingId
								? {
										...booking,
										notes: booking.notes.filter(note => note.id !== noteId),
									}
								: booking,
						) ?? [],
				);

				return { previous };
			},
			onError: (_error, _noteId, context) => {
				if (context?.previous) {
					queryClient.setQueryData(
						queryKeys.classBookings(classId),
						context.previous,
					);
				}
			},
			onSettled: () => {
				queryClient.invalidateQueries(queryKeys.classBookings(classId));
			},
		},
	);

export const useRestoreBookingNote = (classId: string) =>
	useMutation(
		async ({
			bookingId,
			noteId,
		}: {
			bookingId: string;
			noteId: string;
		}) => {
			const res = await API_SERVICE.post(
				API.BOOKINGS.RESTORE_NOTE(bookingId, noteId),
			);
			return res.data as { note: BookingNote };
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries(queryKeys.classBookings(classId));
			},
		},
	);
