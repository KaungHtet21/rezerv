import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { CButton, CInput, CText } from '~shared/presentation/ui';
import { spacing, useColors } from '~shared/presentation/design';
import { getApiErrorMessage } from '~shared/domain/errors';
import type { BookingNote } from '~domains/scheduling/domain';
import { useUpdateBookingNote } from '~domains/scheduling/application/bookingMutations';

type NoteItem = Pick<BookingNote, 'id' | 'content' | 'createdAt' | 'updatedAt'>;

type NoteListItemProps = {
	item: NoteItem;
	classId: string;
	bookingId: string;
	onDelete: (noteId: string, content: string) => void;
	isDeleting?: boolean;
};

const NoteListItem = ({
	item,
	classId,
	bookingId,
	onDelete,
	isDeleting = false,
}: NoteListItemProps) => {
	const colors = useColors();
	const [isEditing, setIsEditing] = useState(false);
	const [editText, setEditText] = useState('');

	const { mutate: updateNote, isLoading: isUpdatingNote } = useUpdateBookingNote(
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
		onDelete(item.id, item.content);
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
							loading={isDeleting}
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
