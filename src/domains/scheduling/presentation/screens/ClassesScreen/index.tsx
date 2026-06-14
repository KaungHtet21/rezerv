import React, { useCallback, useMemo, useState } from 'react';
import {
	ActivityIndicator,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import { CButton, CScreen, CText, IconComp } from '~shared/presentation/ui';
import { ClassDatePickerSheet } from '~domains/scheduling/presentation/sheets';
import { useGlobalBottomSheet } from '~shared/presentation/layouts';
import { ClassList } from '~domains/scheduling/presentation/lists';
import { iconSize, spacing, useColors } from '~shared/presentation/design';
import { useClassesByDate } from '~domains/scheduling/application/bookingMutations';
import { getApiErrorMessage } from '~shared/domain/errors';
import {
	getClassesEmptyMessage,
	getClassesScreenTitle,
	getTodayISO,
} from '~shared/utils/date';

const ClassesScreen = () => {
	const colors = useColors();
	const { openSheet, closeSheet } = useGlobalBottomSheet();
	const [selectedDate, setSelectedDate] = useState(getTodayISO);

	const { data, isLoading, isError, error, refetch, isFetching } =
		useClassesByDate(selectedDate);

	const screenTitle = useMemo(
		() => getClassesScreenTitle(selectedDate),
		[selectedDate],
	);

	const emptyMessage = useMemo(
		() => getClassesEmptyMessage(selectedDate),
		[selectedDate],
	);

	const handleOpenDatePicker = useCallback(() => {
		openSheet(
			<ClassDatePickerSheet
				value={selectedDate}
				onConfirm={(value: string) => {
					setSelectedDate(value);
					closeSheet();
				}}
			/>,
			{ snapPoint: '45%' },
		);
	}, [closeSheet, openSheet, selectedDate]);

	const renderContent = () => {
		if (isLoading && !data) {
			return (
				<View style={styles.centered}>
					<ActivityIndicator size="large" color={colors.primary} />
					<CText variant="body" style={{ marginTop: spacing.md }}>
						Loading classes...
					</CText>
				</View>
			);
		}

		if (isError) {
			return (
				<View style={styles.centered}>
					<CText variant="body" align="center" color={colors.error}>
						{getApiErrorMessage(error, 'Failed to load classes.')}
					</CText>
					<CButton
						title="Retry"
						onPress={() => refetch()}
						style={{ marginTop: spacing.lg }}
					/>
				</View>
			);
		}

		return (
			<ClassList
				data={data ?? []}
				onRefresh={refetch}
				isFetching={isFetching && !isLoading}
				ListEmptyComponent={
					<View style={styles.centered}>
						<CText variant="subtitle" weight="semiBold">
							{emptyMessage}
						</CText>
						<CText
							variant="body"
							color={colors.placeholder}
							align="center"
							style={{ marginTop: spacing.sm }}>
							Pull down to refresh when new classes are scheduled.
						</CText>
					</View>
				}
			/>
		);
	};

	return (
		<CScreen isTabScreen contentStyle={styles.container}>
			<View style={styles.header}>
				<CText variant="headline" weight="bold" style={styles.title}>
					{screenTitle}
				</CText>
				<TouchableOpacity
					activeOpacity={0.7}
					onPress={handleOpenDatePicker}
					hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
					accessibilityRole="button"
					accessibilityLabel="Choose date">
					<IconComp
						name="calendar-outline"
						size={iconSize.lg}
						color={colors.title}
					/>
				</TouchableOpacity>
			</View>
			{renderContent()}
		</CScreen>
	);
};

export default ClassesScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: spacing.lg,
		paddingTop: spacing.lg,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: spacing.lg,
		gap: spacing.md,
	},
	title: {
		flex: 1,
	},
	centered: {
		flex: 1,
		minHeight: 240,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: spacing.lg,
	},
});
