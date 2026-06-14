import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { CButton, CText } from '~shared/presentation/ui';
import {
	DEFAULT_DOB,
	formatDateISO,
	MAX_DOB,
	MIN_DOB,
	parseDateISO,
} from '~shared/utils/date';
import { spacing } from '~shared/presentation/design';

type DateOfBirthPickerSheetProps = {
	value: string;
	onConfirm: (value: string) => void;
};

export const DateOfBirthPickerSheet: React.FC<DateOfBirthPickerSheetProps> = ({
	value,
	onConfirm,
}) => {
	const [selectedDate, setSelectedDate] = useState(
		parseDateISO(value) ?? DEFAULT_DOB,
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
				Select date of birth
			</CText>
			<DateTimePicker
				value={selectedDate}
				mode="date"
				display="spinner"
				minimumDate={MIN_DOB}
				maximumDate={MAX_DOB}
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
