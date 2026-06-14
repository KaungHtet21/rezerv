import React, { useMemo } from 'react';
import {
	ActivityIndicator,
	StyleSheet,
	View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NavigationProp, RouteProp } from '@react-navigation/native';
import { CButton, CScreen, CText } from '~app/common';
import { BookingList } from '~app/list';
import { spacing, useAccent, useColors } from '~core/design';
import type { ClassesStackParamList } from '~core/navigation/config/types';
import { getApiErrorMessage } from '~core/server/apis/auth';
import type { Booking } from '~core/server/apis/classes';
import { useClassBookings } from '~core/server/mutations/classes';

type RouteProps = RouteProp<ClassesStackParamList, 'ClassDetail'>;
type NavigationProps = NavigationProp<ClassesStackParamList, 'ClassDetail'>;

const ClassDetailScreen = () => {
	const route = useRoute<RouteProps>();
	const navigation = useNavigation<NavigationProps>();
	const colors = useColors();
	const accent = useAccent();
	const { classId, className, instructor, timeLabel, attendanceLabel } =
		route.params;

	const { data, isLoading, isError, error, refetch } =
		useClassBookings(classId);

	const headerSubtitle = useMemo(
		() => `${instructor} · ${timeLabel} · ${attendanceLabel}`,
		[instructor, timeLabel, attendanceLabel],
	);

	const handleSeeNotes = (booking: Booking) => {
		navigation.navigate('BookingNotes', {
			classId,
			bookingId: booking.id,
			attendeeName: booking.attendeeName,
		});
	};

	const renderContent = () => {
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

		return (
			<BookingList
				data={data ?? []}
				classId={classId}
				onRefresh={refetch}
				onSeeNotes={handleSeeNotes}
				ListEmptyComponent={
					<View style={styles.centered}>
						<CText variant="body" color={colors.placeholder}>
							No bookings for this class.
						</CText>
					</View>
				}
			/>
		);
	};

	return (
		<CScreen
			canGoBack
			hasHeader
			headerTitle={className}
			isTabScreen
			contentStyle={styles.container}>
			<CText variant="label" color={accent.primary} style={styles.subtitle}>
				{headerSubtitle}
			</CText>
			{renderContent()}
		</CScreen>
	);
};

export default ClassDetailScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: spacing.lg,
	},
	subtitle: {
		marginBottom: spacing.lg,
	},
	centered: {
		flex: 1,
		minHeight: 160,
		alignItems: 'center',
		justifyContent: 'center',
	},
});
