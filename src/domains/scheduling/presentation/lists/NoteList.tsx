import React, { useCallback, useState } from 'react';
import {
	FlatList,
	RefreshControl,
	StyleSheet,
	View,
} from 'react-native';
import { CButton, CInput, CText } from '~shared/presentation/ui';
import { NoteListItem } from '~domains/scheduling/presentation/entities';
import { spacing, useColors } from '~shared/presentation/design';
import type { BookingNote } from '~domains/scheduling/domain';

type NoteItem = Pick<BookingNote, 'id' | 'content' | 'createdAt' | 'updatedAt'>;

type NoteListProps = {
	data: NoteItem[];
	classId: string;
	bookingId: string;
	onRefresh: () => Promise<unknown>;
	onDeleteSuccess: (noteId: string, content: string) => void;
	noteText: string;
	onNoteTextChange: (text: string) => void;
	onAddNote: () => void;
	isCreatingNote: boolean;
	isFetching?: boolean;
	ListEmptyComponent?: React.ReactElement;
};

const NoteList = ({
	data,
	classId,
	bookingId,
	onRefresh,
	onDeleteSuccess,
	noteText,
	onNoteTextChange,
	onAddNote,
	isCreatingNote,
	isFetching = false,
	ListEmptyComponent,
}: NoteListProps) => {
	const colors = useColors();
	const [refreshing, setRefreshing] = useState(false);

	const handleRefresh = useCallback(async () => {
		setRefreshing(true);
		try {
			await onRefresh();
		} finally {
			setRefreshing(false);
		}
	}, [onRefresh]);

	return (
		<FlatList
			style={styles.list}
			data={data}
			keyExtractor={item => item.id}
			renderItem={({ item }) => (
				<NoteListItem
					item={item}
					classId={classId}
					bookingId={bookingId}
					onDeleteSuccess={onDeleteSuccess}
				/>
			)}
			showsVerticalScrollIndicator={false}
			contentContainerStyle={styles.content}
			refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
			}
			ListEmptyComponent={ListEmptyComponent}
			ListFooterComponent={
				<View>
					<CInput
						value={noteText}
						onChangeText={onNoteTextChange}
						label="Add note"
						placeholder="Add a private note"
						multiline
					/>
					<CButton
						title="Add note"
						size="sm"
						onPress={onAddNote}
						disabled={!noteText.trim()}
						loading={isCreatingNote}
					/>
					{isFetching ? (
						<CText
							variant="caption"
							color={colors.placeholder}
							align="center"
							style={styles.footer}>
							Refreshing...
						</CText>
					) : null}
				</View>
			}
		/>
	);
};

export default NoteList;

const styles = StyleSheet.create({
	list: {
		flex: 1,
	},
	content: {
		flexGrow: 1,
		paddingBottom: spacing.xxxl,
	},
	footer: {
		marginTop: spacing.md,
	},
});
