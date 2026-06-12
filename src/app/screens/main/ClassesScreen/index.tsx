import React from 'react';
import {
	ActivityIndicator,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CButton, CScreen, CText } from '~app/common';
import { spacing, useAccent, useColors } from '~core/design';
import type { ClassSummary } from '~core/server/apis/classes';
import { useTodayClasses } from '~core/server/classes-api';
import { getApiErrorMessage } from '~core/server/apis/auth';
import type { ClassesStackParamList } from '~core/navigation/config/types';

type NavigationProp = NativeStackNavigationProp<
	ClassesStackParamList,
	'ClassesList'
>;

const ClassListItem = ({
	item,
	onPress,
}: {
	item: ClassSummary;
	onPress: () => void;
}) => {
	const colors = useColors();
	const accent = useAccent();

	return (
		<TouchableOpacity
			activeOpacity={0.7}
			onPress={onPress}
			style={[styles.card, { borderColor: colors.border, backgroundColor: colors.card }]}>
			<CText variant="subtitle" weight="semiBold">
				{item.name}
			</CText>
			<CText variant="body" color={colors.content} style={{ marginTop: spacing.xs }}>
				{item.instructor}
			</CText>
			<CText variant="label" color={accent.primary} style={{ marginTop: spacing.sm }}>
				{item.timeLabel}
			</CText>
			<CText variant="label" color={colors.placeholder} style={{ marginTop: spacing.xs }}>
				{item.attendanceLabel}
			</CText>
		</TouchableOpacity>
	);
};

const ClassesScreen = () => {
	const navigation = useNavigation<NavigationProp>();
	const colors = useColors();
	const { data, isLoading, isError, error, refetch, isFetching } = useTodayClasses();

	const handleOpenClass = (item: ClassSummary) => {
		navigation.navigate('ClassDetail', {
			classId: item.id,
			className: item.name,
			instructor: item.instructor,
			timeLabel: item.timeLabel,
			attendanceLabel: item.attendanceLabel,
		});
	};

	const renderContent = () => {
		if (isLoading && !data) {
			return (
				<View style={styles.centered}>
					<ActivityIndicator size="large" color={colors.primary} />
					<CText variant="body" style={{ marginTop: spacing.md }}>
						Loading today's classes...
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

		if (!data?.length) {
			return (
				<View style={styles.centered}>
					<CText variant="subtitle" weight="semiBold">
						No classes today
					</CText>
					<CText
						variant="body"
						color={colors.placeholder}
						align="center"
						style={{ marginTop: spacing.sm }}>
						Pull down to refresh when new classes are scheduled.
					</CText>
				</View>
			);
		}

		return data.map(item => (
			<ClassListItem
				key={item.id}
				item={item}
				onPress={() => handleOpenClass(item)}
			/>
		));
	};

	return (
		<CScreen
			isTabScreen
			isScroll
			onRefresh={async () => {
				await refetch();
			}}
			contentContainerStyle={styles.container}>
			<CText variant="headline" weight="bold" style={{ marginBottom: spacing.lg }}>
				Today's Classes
			</CText>
			{renderContent()}
			{isFetching && !isLoading ? (
				<CText
					variant="caption"
					color={colors.placeholder}
					align="center"
					style={{ marginTop: spacing.md }}>
					Refreshing...
				</CText>
			) : null}
		</CScreen>
	);
};

export default ClassesScreen;

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: spacing.lg,
		paddingTop: spacing.lg,
		paddingBottom: spacing.xxl,
	},
	card: {
		borderWidth: 1,
		borderRadius: 12,
		padding: spacing.lg,
		marginBottom: spacing.md,
	},
	centered: {
		flex: 1,
		minHeight: 240,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: spacing.lg,
	},
});
