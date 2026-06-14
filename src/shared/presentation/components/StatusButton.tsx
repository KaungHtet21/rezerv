import { ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import { CText } from "~shared/presentation/ui";
import { spacing, useColors } from "~shared/presentation/design";
import { useAccent } from "~shared/presentation/design";

export const StatusButton = ({
	label,
	active,
	onPress,
	disabled,
	loading,
}: {
	label: string;
	active: boolean;
	onPress: () => void;
	disabled?: boolean;
	loading?: boolean;
}) => {
	const colors = useColors();
	const accent = useAccent();
	const spinnerColor = active ? '#FFFFFF' : colors.content;

	return (
		<TouchableOpacity
			disabled={disabled || loading}
			onPress={onPress}
			style={[
				styles.statusButton,
				{
					borderColor: active ? accent.primary : colors.border,
					backgroundColor: active ? accent.primary : colors.card,
					opacity: loading ? 0.85 : 1,
				},
			]}>
			{loading ? (
				<ActivityIndicator color={spinnerColor} size="small" />
			) : (
				<CText
					variant="caption"
					weight="semiBold"
					color={active ? '#FFFFFF' : colors.content}>
					{label}
				</CText>
			)}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	statusButton: {
		minWidth: 72,
		minHeight: 28,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.xs,
		borderRadius: spacing.sm,
	},
});