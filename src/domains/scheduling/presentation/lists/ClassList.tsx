import React, { useCallback, useState } from 'react';
import {
	FlatList,
	RefreshControl,
	StyleSheet
} from 'react-native';
import { CText } from '~shared/presentation/ui';
import { spacing, useColors } from '~shared/presentation/design';
import type { ClassSummary } from '~domains/scheduling/domain';
import { ClassListItem } from '~domains/scheduling/presentation/entities';

type ClassListProps = {
	data: ClassSummary[];
	onRefresh: () => Promise<unknown>;
	isFetching?: boolean;
	ListEmptyComponent?: React.ReactElement;
};

const ClassList = ({
	data,
	onRefresh,
	isFetching = false,
	ListEmptyComponent,
}: ClassListProps) => {
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
			renderItem={({ item }) => <ClassListItem item={item} />}
			showsVerticalScrollIndicator={false}
			contentContainerStyle={styles.content}
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

export default ClassList;

const styles = StyleSheet.create({
	list: {
		flex: 1,
	},
	content: {
		flexGrow: 1,
		paddingBottom: spacing.xxl,
	},
	footer: {
		marginTop: spacing.md,
	},
});
