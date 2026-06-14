import React, { useCallback, useState } from 'react';
import {
	FlatList,
	RefreshControl,
	StyleSheet,
} from 'react-native';
import { CText } from '~shared/presentation/ui';
import { NoteListItem } from '~domains/scheduling/presentation/entities';
import { spacing, useColors } from '~shared/presentation/design';
import type { BookingNote } from '~domains/scheduling/domain';

type NoteItem = Pick<BookingNote, 'id' | 'content' | 'createdAt' | 'updatedAt'>;

type NoteListProps = {
	data: NoteItem[];
	classId: string;
	bookingId: string;
	onRefresh: () => Promise<unknown>;
	onDelete: (noteId: string, content: string) => void;
	deletingNoteId?: string | null;
	isFetching?: boolean;
	contentPaddingBottom?: number;
	ListEmptyComponent?: React.ReactElement;
};

const NoteList = ({
	data,
	classId,
	bookingId,
	onRefresh,
	onDelete,
	deletingNoteId = null,
	isFetching = false,
	contentPaddingBottom = spacing.md,
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
					onDelete={onDelete}
					isDeleting={deletingNoteId === item.id}
				/>
			)}
			showsVerticalScrollIndicator={false}
			keyboardShouldPersistTaps="handled"
			keyboardDismissMode="on-drag"
			contentContainerStyle={[styles.content, { paddingBottom: contentPaddingBottom }]}
			refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
			}
			ListEmptyComponent={ListEmptyComponent}
			ListFooterComponent={
				isFetching ? (
					<CText
						variant="caption"
						color={colors.placeholder}
						align="center"
						style={styles.footer}>
						Refreshing...
					</CText>
				) : null
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
	},
	footer: {
		marginTop: spacing.md,
	},
});
