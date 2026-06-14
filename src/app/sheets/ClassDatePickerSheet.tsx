import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { CButton, CText } from '~app/common';
import { spacing } from '~core/design';
import { formatDateISO, parseDateISO } from '~core/utils/date';

type ClassDatePickerSheetProps = {
	value: string;
	onConfirm: (value: string) => void;
};

export const ClassDatePickerSheet: React.FC<ClassDatePickerSheetProps> = ({
	value,
	onConfirm,
}) => {
	const [selectedDate, setSelectedDate] = useState(
		parseDateISO(value) ?? new Date(),
	);

	const handleChange = (_event: unknown, date?: Date) => {
		if (date) {
			setSelectedDate(date);
		}
	};

	return (
		<View style={styles.container}>
			<CText
				variant="subtitle"
				weight="semiBold"
				align="center"
				style={{ marginBottom: spacing.lg }}>
				Select date
			</CText>
			<DateTimePicker
				value={selectedDate}
				mode="date"
				display="spinner"
				onChange={handleChange}
			/>
			<CButton
				title="Confirm"
				onPress={() => onConfirm(formatDateISO(selectedDate))}
				size="lg"
				style={{ marginTop: spacing.lg }}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: spacing.lg,
		paddingTop: spacing.sm,
		paddingBottom: spacing.md,
	},
});
