import React, { useMemo, useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import { CButton, CInput, CScreen, CText } from '~app/common';
import { spacing, useAccent, useColors } from '~core/design';
import {
	ATTENDANCE_STATUSES,
	BOOKING_STATUS_LABELS,
	type Booking,
	type BookingStatus,
} from '~core/server/apis/classes';
import { getApiErrorMessage } from '~core/server/apis/auth';
import {
	useClassBookings,
	useCreateBookingNote,
	useDeleteBookingNote,
	useRestoreBookingNote,
	useUpdateBookingNote,
	useUpdateBookingStatus,
} from '~core/server/classes-api';
import type { ClassesStackParamList } from '~core/navigation/config/types';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';

type RouteProps = RouteProp<ClassesStackParamList, 'ClassDetail'>;

type UndoState = {
	bookingId: string;
	noteId: string;
	content: string;
};

const StatusButton = ({
	label,
	active,
	onPress,
	disabled,
}: {
	label: string;
	active: boolean;
	onPress: () => void;
	disabled?: boolean;
}) => {
	const colors = useColors();
	const accent = useAccent();

	return (
		<TouchableOpacity
			disabled={disabled}
			onPress={onPress}
			style={[
				styles.statusButton,
				{
					borderColor: active ? accent.primary : colors.border,
					backgroundColor: active ? accent.primary : colors.card,
				},
			]}>
			<CText
				variant="caption"
				weight="semiBold"
				color={active ? '#FFFFFF' : colors.content}>
				{label}
			</CText>
		</TouchableOpacity>
	);
};

const BookingCard = ({
	booking,
	classId,
	onUndoReady,
}: {
	booking: Booking;
	classId: string;
	onUndoReady: (undo: UndoState) => void;
}) => {
	const colors = useColors();
	const [noteText, setNoteText] = useState('');
	const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
	const [editText, setEditText] = useState('');

	const { mutate: updateStatus, isLoading: isUpdatingStatus } =
		useUpdateBookingStatus(classId);
	const { mutate: createNote, isLoading: isCreatingNote } =
		useCreateBookingNote(classId, booking.id);
	const { mutate: updateNote, isLoading: isUpdatingNote } = useUpdateBookingNote(
		classId,
		booking.id,
	);
	const { mutate: deleteNote, isLoading: isDeletingNote } = useDeleteBookingNote(
		classId,
		booking.id,
	);

	const handleStatusChange = (status: BookingStatus) => {
		if (booking.status === status) return;
		updateStatus(
			{ bookingId: booking.id, status },
			{
				onError: error => {
					Alert.alert(getApiErrorMessage(error, 'Could not update status.'));
				},
			},
		);
	};

	const handleAddNote = () => {
		const content = noteText.trim();
		if (!content) return;

		createNote(content, {
			onSuccess: () => setNoteText(''),
			onError: error => {
				Alert.alert(getApiErrorMessage(error, 'Could not add note.'));
			},
		});
	};

	const handleSaveEdit = (noteId: string) => {
		const content = editText.trim();
		if (!content) return;

		updateNote(
			{ noteId, content },
			{
				onSuccess: () => {
					setEditingNoteId(null);
					setEditText('');
				},
				onError: error => {
					Alert.alert(getApiErrorMessage(error, 'Could not update note.'));
				},
			},
		);
	};

	const handleDeleteNote = (noteId: string, content: string) => {
		deleteNote(noteId, {
			onSuccess: () => {
				onUndoReady({ bookingId: booking.id, noteId, content });
			},
			onError: error => {
				Alert.alert(getApiErrorMessage(error, 'Could not delete note.'));
			},
		});
	};

	return (
		<View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.card }]}>
			<CText variant="subtitle" weight="semiBold">
				{booking.attendeeName}
			</CText>
			{booking.attendeeEmail ? (
				<CText variant="label" color={colors.placeholder} style={{ marginTop: spacing.xs }}>
					{booking.attendeeEmail}
				</CText>
			) : null}

			<CText variant="label" weight="medium" style={{ marginTop: spacing.md, marginBottom: spacing.sm }}>
				Status
			</CText>
			<View style={styles.statusRow}>
				{ATTENDANCE_STATUSES.map(status => (
					<StatusButton
						key={status}
						label={BOOKING_STATUS_LABELS[status]}
						active={booking.status === status}
						disabled={isUpdatingStatus}
						onPress={() => handleStatusChange(status)}
					/>
				))}
			</View>

			<CText variant="label" weight="medium" style={{ marginTop: spacing.lg, marginBottom: spacing.sm }}>
				Notes
			</CText>

			{booking.notes.map(note => (
				<View
					key={note.id}
					style={[styles.noteItem, { borderColor: colors.border }]}>
					{editingNoteId === note.id ? (
						<>
							<CInput
								value={editText}
								onChangeText={setEditText}
								placeholder="Edit note"
								multiline
							/>
							<View style={styles.noteActions}>
								<CButton
									title="Save"
									size="sm"
									onPress={() => handleSaveEdit(note.id)}
									loading={isUpdatingNote}
								/>
								<CButton
									title="Cancel"
									size="sm"
									variant="outline"
									onPress={() => {
										setEditingNoteId(null);
										setEditText('');
									}}
								/>
							</View>
						</>
					) : (
						<>
							<CText variant="body">{note.content}</CText>
							<View style={styles.noteActions}>
								<CButton
									title="Edit"
									size="sm"
									variant="ghost"
									onPress={() => {
										setEditingNoteId(note.id);
										setEditText(note.content);
									}}
								/>
								<CButton
									title="Delete"
									size="sm"
									variant="outline"
									onPress={() => handleDeleteNote(note.id, note.content)}
									loading={isDeletingNote}
								/>
							</View>
						</>
					)}
				</View>
			))}

			<CInput
				value={noteText}
				onChangeText={setNoteText}
				placeholder="Add a private note"
				multiline
			/>
			<CButton
				title="Add note"
				size="sm"
				onPress={handleAddNote}
				disabled={!noteText.trim()}
				loading={isCreatingNote}
			/>
		</View>
	);
};

const ClassDetailScreen = () => {
	const route = useRoute<RouteProps>();
	const colors = useColors();
	const accent = useAccent();
	const { classId, className, instructor, timeLabel, attendanceLabel } =
		route.params;

	const { data, isLoading, isError, error, refetch, isFetching } =
		useClassBookings(classId);
	const { mutate: restoreNote, isLoading: isRestoringNote } =
		useRestoreBookingNote(classId);

	const [undo, setUndo] = useState<UndoState | null>(null);

	const handleUndo = () => {
		if (!undo) return;

		restoreNote(
			{ bookingId: undo.bookingId, noteId: undo.noteId },
			{
				onSuccess: () => setUndo(null),
				onError: err => {
					Alert.alert(getApiErrorMessage(err, 'Could not restore note.'));
				},
			},
		);
	};

	const headerSubtitle = useMemo(
		() => `${instructor} · ${timeLabel} · ${attendanceLabel}`,
		[instructor, timeLabel, attendanceLabel],
	);

	const renderBody = () => {
		if (isLoading && !data) {
			return (
				<View style={styles.centered}>
					<ActivityIndicator size="large" color={colors.primary} />
				</View>
			);
		}

		if (isError) {
			return (
				<View style={styles.centered}>
					<CText variant="body" color={colors.error} align="center">
						{getApiErrorMessage(error, 'Failed to load bookings.')}
					</CText>
					<CButton title="Retry" onPress={() => refetch()} style={{ marginTop: spacing.lg }} />
				</View>
			);
		}

		if (!data?.length) {
			return (
				<View style={styles.centered}>
					<CText variant="body" color={colors.placeholder}>
						No bookings for this class.
					</CText>
				</View>
			);
		}

		return data.map(booking => (
			<BookingCard
				key={booking.id}
				booking={booking}
				classId={classId}
				onUndoReady={setUndo}
			/>
		));
	};

	return (
		<CScreen
			isScroll
			canGoBack
			hasHeader
			headerTitle={className}
			onRefresh={async () => {
				await refetch();
			}}
			contentContainerStyle={styles.container}
			footer={
				undo ? (
					<View style={[styles.undoBar, { backgroundColor: colors.title }]}>
						<CText variant="label" color="#FFFFFF" style={{ flex: 1 }}>
							Note deleted
						</CText>
						<CButton
							title="Undo"
							size="sm"
							variant="outline"
							onPress={handleUndo}
							loading={isRestoringNote}
							style={styles.undoButton}
							textStyle={{ color: '#FFFFFF' }}
						/>
					</View>
				) : undefined
			}>
			<CText variant="label" color={accent.primary} style={{ marginBottom: spacing.lg }}>
				{headerSubtitle}
			</CText>

			{renderBody()}

			{isFetching && !isLoading ? (
				<CText variant="caption" color={colors.placeholder} align="center">
					Refreshing...
				</CText>
			) : null}
		</CScreen>
	);
};

export default ClassDetailScreen;

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: spacing.lg,
		paddingBottom: spacing.xxxl,
	},
	card: {
		borderWidth: 1,
		borderRadius: 12,
		padding: spacing.lg,
		marginBottom: spacing.lg,
	},
	statusRow: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: spacing.sm,
	},
	statusButton: {
		borderWidth: 1,
		borderRadius: 999,
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.sm,
	},
	noteItem: {
		borderWidth: 1,
		borderRadius: 8,
		padding: spacing.md,
		marginBottom: spacing.sm,
	},
	noteActions: {
		flexDirection: 'row',
		gap: spacing.sm,
		marginTop: spacing.sm,
	},
	centered: {
		minHeight: 160,
		alignItems: 'center',
		justifyContent: 'center',
	},
	undoBar: {
		borderRadius: 8,
		padding: spacing.md,
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.md,
	},
	undoButton: {
		borderColor: '#FFFFFF',
	},
});
