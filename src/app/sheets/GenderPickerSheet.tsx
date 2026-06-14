import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { CText, IconComp } from '~app/common';
import { GENDER_OPTIONS, type GenderOption } from '~constants/gender';
import { spacing, useAccent, useColors } from '~core/design';

type GenderPickerSheetProps = {
	selected: GenderOption;
	onSelect: (value: GenderOption) => void;
};

export const GenderPickerSheet: React.FC<GenderPickerSheetProps> = ({
	selected,
	onSelect,
}) => {
	const colors = useColors();
	const accent = useAccent();

	return (
		<View style={styles.container}>
			<CText
				variant="subtitle"
				weight="semiBold"
				align="center"
				style={{ marginBottom: spacing.lg }}>
				Select gender
			</CText>
			{GENDER_OPTIONS.map(option => {
				const isSelected = selected === option.value;

				return (
					<Pressable
						key={option.value}
						onPress={() => onSelect(option.value)}
						style={[
							styles.row,
							{
								borderColor: colors.border,
								backgroundColor: isSelected ? colors.card : colors.background,
							},
						]}>
						<CText variant="body">{option.label}</CText>
						{isSelected ? (
							<IconComp name="checkmark" size={20} color={accent.primary} />
						) : null}
					</Pressable>
				);
			})}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: spacing.lg,
		paddingTop: spacing.sm,
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderWidth: 1,
		borderRadius: 12,
		paddingHorizontal: spacing.lg,
		paddingVertical: spacing.md,
		marginBottom: spacing.sm,
	},
});
