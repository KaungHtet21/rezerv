import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { CButton, CInput, CText } from '~app/common';
import { spacing, useColors } from '~core/design';
import { getApiErrorMessage } from '~core/server/apis/auth';
import type { BookingNote } from '~core/server/apis/classes';
import {
	useDeleteBookingNote,
	useUpdateBookingNote,
} from '~core/server/mutations/classes';

type NoteItem = Pick<BookingNote, 'id' | 'content' | 'createdAt' | 'updatedAt'>;

type NoteListItemProps = {
	item: NoteItem;
	classId: string;
	bookingId: string;
	onDeleteSuccess: (noteId: string, content: string) => void;
};

const NoteListItem = ({
	item,
	classId,
	bookingId,
	onDeleteSuccess,
}: NoteListItemProps) => {
	const colors = useColors();
	const [isEditing, setIsEditing] = useState(false);
	const [editText, setEditText] = useState('');

	const { mutate: updateNote, isLoading: isUpdatingNote } = useUpdateBookingNote(
		classId,
		bookingId,
	);
	const { mutate: deleteNote, isLoading: isDeletingNote } = useDeleteBookingNote(
		classId,
		bookingId,
	);

	const handleSaveEdit = () => {
		const content = editText.trim();
		if (!content) return;

		updateNote(
			{ noteId: item.id, content },
			{
				onSuccess: () => {
					setIsEditing(false);
					setEditText('');
				},
				onError: err => {
					Alert.alert(getApiErrorMessage(err, 'Could not update note.'));
				},
			},
		);
	};

	const handleDelete = () => {
		deleteNote(item.id, {
			onSuccess: () => onDeleteSuccess(item.id, item.content),
			onError: err => {
				Alert.alert(getApiErrorMessage(err, 'Could not delete note.'));
			},
		});
	};

	const handleStartEdit = () => {
		setIsEditing(true);
		setEditText(item.content);
	};

	const handleCancelEdit = () => {
		setIsEditing(false);
		setEditText('');
	};

	return (
		<View
			style={[styles.noteItem, { borderColor: colors.border, backgroundColor: colors.card }]}>
			{isEditing ? (
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
							onPress={handleSaveEdit}
							loading={isUpdatingNote}
						/>
						<CButton
							title="Cancel"
							size="sm"
							variant="outline"
							onPress={handleCancelEdit}
						/>
					</View>
				</>
			) : (
				<>
					<CText variant="body">{item.content}</CText>
					<View style={styles.noteActions}>
						<CButton title="Edit" size="sm" variant="ghost" onPress={handleStartEdit} />
						<CButton
							title="Delete"
							size="sm"
							variant="outline"
							onPress={handleDelete}
							loading={isDeletingNote}
						/>
					</View>
				</>
			)}
		</View>
	);
};

export default React.memo(NoteListItem);

const styles = StyleSheet.create({
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
});
