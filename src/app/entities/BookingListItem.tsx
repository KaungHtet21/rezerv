import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { CLinkText, CText } from '~app/common';
import { StatusButton } from '~app/components/StatusButton';
import { spacing, useColors } from '~core/design';
import { getApiErrorMessage } from '~core/server/apis/auth';
import {
	ATTENDANCE_STATUSES,
	BOOKING_STATUS_LABELS,
	type Booking,
	type BookingStatus,
} from '~core/server/apis/classes';
import { useUpdateBookingStatus } from '~core/server/mutations/classes';

type BookingListItemProps = {
	item: Booking;
	classId: string;
	onSeeNotes: () => void;
};

const BookingListItem = ({ item, classId, onSeeNotes }: BookingListItemProps) => {
	const colors = useColors();
	const { mutate: updateStatus, isLoading: isUpdatingStatus } =
		useUpdateBookingStatus(classId);

	const handleStatusChange = (status: BookingStatus) => {
		if (item.status === status) return;
		updateStatus(
			{ bookingId: item.id, status },
			{
				onError: error => {
					Alert.alert(getApiErrorMessage(error, 'Could not update status.'));
				},
			},
		);
	};

	const notesLabel =
		item.notes.length > 0
			? `See all notes (${item.notes.length})`
			: 'See all notes';

	return (
		<View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.card }]}>
			<CText variant="subtitle" weight="semiBold">
				{item.attendeeName}
			</CText>
			{item.attendeeEmail ? (
				<CText variant="label" color={colors.placeholder} style={{ marginTop: spacing.xs }}>
					{item.attendeeEmail}
				</CText>
			) : null}

			<CText variant="label" weight="medium" style={{ marginTop: spacing.md, marginBottom: spacing.sm }}>
				Status
			</CText>
			<View style={styles.statusRow}>
				{ATTENDANCE_STATUSES.map(status => (
					<StatusButton
						key={status}
						label={BOOKING_STATUS_LABELS[status]}
						active={item.status === status}
						disabled={isUpdatingStatus}
						onPress={() => handleStatusChange(status)}
					/>
				))}
			</View>

			<CText variant="label" weight="medium" style={{ marginTop: spacing.lg, marginBottom: spacing.sm }}>
				Notes
			</CText>
			<CLinkText label={notesLabel} onPress={onSeeNotes} />
		</View>
	);
};

export default React.memo(BookingListItem);

const styles = StyleSheet.create({
	card: {
		borderWidth: 1,
		borderRadius: 12,
		padding: spacing.lg,
		marginBottom: spacing.lg,
	},
	statusRow: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: spacing.sm,
	},
});
