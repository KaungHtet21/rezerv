import { StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { CText } from '~app/common';
import { spacing, useAccent, useColors } from '~core/design';
import type { ClassSummary } from '~core/server/apis/classes';
import { useNavigation } from '@react-navigation/native';
import type { ClassesStackParamList } from '~core/navigation/config/types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type NavigationProp = NativeStackNavigationProp<
	ClassesStackParamList,
	'ClassesList'
>;

const ClassListItem = ({item}: {item: ClassSummary}) => {
    const colors = useColors();
	const accent = useAccent();
    const navigation = useNavigation<NavigationProp>();

    const handleOpenClass = (item: ClassSummary) => {
		navigation.navigate('ClassDetail', {
			classId: item.id,
			className: item.name,
			instructor: item.instructor,
			timeLabel: item.timeLabel,
			attendanceLabel: item.attendanceLabel,
		});
	};

	return (
		<TouchableOpacity
			activeOpacity={0.7}
			onPress={() => handleOpenClass(item)}
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
}

const styles = StyleSheet.create({
    card: {
		borderWidth: 1,
		borderRadius: 12,
		padding: spacing.lg,
		marginBottom: spacing.md,
	},
})

export default ClassListItem
