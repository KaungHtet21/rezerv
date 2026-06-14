import { StyleSheet, TouchableOpacity } from "react-native";
import { CText } from "~app/common";
import { spacing, useColors } from "~core/design";
import { useAccent } from "~core/design";

export const StatusButton = ({
	label,
	active,
	onPress,
	disabled,
}: {
	label: string;
	active: boolean;
	onPress: () => void;
	disabled?: boolean;
}) => {
	const colors = useColors();
	const accent = useAccent();

	return (
		<TouchableOpacity
			disabled={disabled}
			onPress={onPress}
			style={[
				styles.statusButton,
				{
					borderColor: active ? accent.primary : colors.border,
					backgroundColor: active ? accent.primary : colors.card,
				},
			]}>
			<CText
				variant="caption"
				weight="semiBold"
				color={active ? '#FFFFFF' : colors.content}>
				{label}
			</CText>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	statusButton: {
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.xs,
		borderRadius: spacing.sm,
	},
});