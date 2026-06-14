import React, { useCallback, useState } from 'react';
import {
	FlatList,
	RefreshControl,
	StyleSheet,
} from 'react-native';
import { spacing } from '~core/design';
import type { Booking } from '~core/server/apis/classes';
import { BookingListItem } from '~app/entities';

type BookingListProps = {
	data: Booking[];
	classId: string;
	onRefresh: () => Promise<unknown>;
	onSeeNotes: (booking: Booking) => void;
	ListEmptyComponent?: React.ReactElement;
};

const BookingList = ({
	data,
	classId,
	onRefresh,
	onSeeNotes,
	ListEmptyComponent,
}: BookingListProps) => {
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
				<BookingListItem
					item={item}
					classId={classId}
					onSeeNotes={() => onSeeNotes(item)}
				/>
			)}
			showsVerticalScrollIndicator={false}
			contentContainerStyle={styles.content}
			refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
			}
			ListEmptyComponent={ListEmptyComponent}
		/>
	);
};

export default BookingList;

const styles = StyleSheet.create({
	list: {
		flex: 1,
	},
	content: {
		flexGrow: 1,
		paddingBottom: spacing.xxxl,
	},
});
