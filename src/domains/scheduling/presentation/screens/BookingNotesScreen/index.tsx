import React, { useMemo, useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	View,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { CButton, CScreen, CText } from '~shared/presentation/ui';
import { NoteComposer } from '~domains/scheduling/presentation/entities';
import { NoteList } from '~domains/scheduling/presentation/lists';
import { componentHeight, spacing, useColors } from '~shared/presentation/design';
import { useKeyboardHeight } from '~shared/presentation/hooks';
import type { ClassesStackParamList } from '~app/navigation/config/types';
import { getApiErrorMessage } from '~shared/domain/errors';
import {
	useClassBookings,
	useCreateBookingNote,
	useDeleteBookingNote,
	useRestoreBookingNote,
} from '~domains/scheduling/application/bookingMutations';

type RouteProps = RouteProp<ClassesStackParamList, 'BookingNotes'>;

type UndoState = {
	noteId: string;
	content: string;
};

const BookingNotesScreen = () => {
	const route = useRoute<RouteProps>();
	const colors = useColors();
	const { classId, bookingId, attendeeName } = route.params;

	const { data, isLoading, isError, error, refetch, isFetching } =
		useClassBookings(classId);
	const { mutate: createNote, isLoading: isCreatingNote } =
		useCreateBookingNote(classId, bookingId);
	const { mutate: deleteNote } = useDeleteBookingNote(classId, bookingId);
	const { mutate: restoreNote, isLoading: isRestoringNote } =
		useRestoreBookingNote(classId);

	const keyboardHeight = useKeyboardHeight();
	const [noteText, setNoteText] = useState('');
	const [undo, setUndo] = useState<UndoState | null>(null);
	const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);

	const booking = useMemo(
		() => data?.find(item => item.id === bookingId),
		[data, bookingId],
	);

	const handleAddNote = () => {
		const content = noteText.trim();
		if (!content) return;

		createNote(content, {
			onSuccess: () => setNoteText(''),
			onError: err => {
				Alert.alert(getApiErrorMessage(err, 'Could not add note.'));
			},
		});
	};

	const handleDeleteNote = (noteId: string, content: string) => {
		setUndo({ noteId, content });
		setDeletingNoteId(noteId);
		deleteNote(noteId, {
			onSettled: () => setDeletingNoteId(null),
			onError: err => {
				setUndo(null);
				Alert.alert(getApiErrorMessage(err, 'Could not delete note.'));
			},
		});
	};

	const handleUndo = () => {
		if (!undo) return;

		restoreNote(
			{ bookingId, noteId: undo.noteId, content: undo.content },
			{
				onSuccess: () => setUndo(null),
				onError: err => {
					Alert.alert(getApiErrorMessage(err, 'Could not restore note.'));
				},
			},
		);
	};

	const renderContent = () => {
		if (isLoading && !booking) {
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
						{getApiErrorMessage(error, 'Failed to load notes.')}
					</CText>
					<CButton title="Retry" onPress={() => refetch()} style={{ marginTop: spacing.lg }} />
				</View>
			);
		}

		if (!booking) {
			return (
				<View style={styles.centered}>
					<CText variant="body" color={colors.placeholder}>
						Booking not found.
					</CText>
				</View>
			);
		}

		return (
			<>
				<NoteList
					data={booking.notes}
					classId={classId}
					bookingId={bookingId}
					onRefresh={refetch}
					onDelete={handleDeleteNote}
					deletingNoteId={deletingNoteId}
					isFetching={isFetching && !isLoading}
					ListEmptyComponent={
						<View style={styles.centered}>
							<CText variant="body" color={colors.placeholder} align="center">
								No notes yet.
							</CText>
						</View>
					}
				/>
				{undo ? (
					<View
						style={[
							styles.undoBar,
							{
								backgroundColor: colors.card,
								borderColor: colors.border,
							},
						]}>
						<CText variant="label" color={colors.title} style={styles.undoText}>
							Note deleted
						</CText>
						<CButton
							title="Undo"
							size="sm"
							variant="outline"
							onPress={handleUndo}
							loading={isRestoringNote}
						/>
					</View>
				) : null}
				{Platform.OS === 'ios' ? (
					<KeyboardAvoidingView
						behavior="padding"
						keyboardVerticalOffset={componentHeight.header}>
						<NoteComposer
							noteText={noteText}
							onNoteTextChange={setNoteText}
							onAddNote={handleAddNote}
							isCreatingNote={isCreatingNote}
						/>
					</KeyboardAvoidingView>
				) : (
					<View style={{ marginBottom: keyboardHeight }}>
						<NoteComposer
							noteText={noteText}
							onNoteTextChange={setNoteText}
							onAddNote={handleAddNote}
							isCreatingNote={isCreatingNote}
						/>
					</View>
				)}
			</>
		);
	};

	return (
		<CScreen
			canGoBack
			hasHeader
			isTabScreen
			headerTitle={attendeeName}
			contentStyle={styles.container}>
			<CText variant="label" color={colors.placeholder} style={styles.subtitle}>
				Private staff notes
			</CText>
			<View style={styles.content}>
				{renderContent()}
			</View>
		</CScreen>
	);
};

export default BookingNotesScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: spacing.lg,
	},
	subtitle: {
		marginBottom: spacing.lg,
	},
	content: {
		flex: 1,
	},
	centered: {
		flex: 1,
		minHeight: 120,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: spacing.lg,
	},
	undoBar: {
		borderRadius: 8,
		borderWidth: 1,
		padding: spacing.md,
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.md,
		marginBottom: spacing.sm,
	},
	undoText: {
		flex: 1,
	},
});
