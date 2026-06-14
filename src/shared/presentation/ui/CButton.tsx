import React from 'react';
import {
	TouchableOpacity,
	ActivityIndicator,
	StyleSheet,
	ViewStyle,
	TextStyle,
} from 'react-native';
import { useDesign } from '~shared/presentation/design';
import CText from './CText';

interface CButtonProps {
	title: string;
	onPress: () => void;
	loading?: boolean;
	disabled?: boolean;
	variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
	size?: 'sm' | 'md' | 'lg';
	style?: ViewStyle;
	textStyle?: TextStyle;
}

const CButton: React.FC<CButtonProps> = ({
	title,
	onPress,
	loading = false,
	disabled = false,
	variant = 'primary',
	size = 'md',
	style,
	textStyle: customTextStyle,
}) => {
	const ds = useDesign();

	const bgColor = disabled
		? ds.colors.btnDisable
		: variant === 'primary'
			? ds.accent.primary
			: variant === 'secondary'
				? ds.colors.card
				: 'transparent';

	const textColor = disabled
		? '#FFFFFF'
		: variant === 'primary'
			? '#FFFFFF'
			: variant === 'secondary'
				? ds.colors.title
				: ds.accent.primary;

	const height = ds.buttonHeight[size];
	const textVariant = size === 'sm' ? 'label' : size === 'lg' ? 'bodyLarge' : 'body';

	return (
		<TouchableOpacity
			onPress={onPress}
			disabled={disabled || loading}
			activeOpacity={0.7}
			style={[
				styles.button,
				{
					backgroundColor: bgColor,
					height,
					borderRadius: ds.radius.md,
					paddingHorizontal: ds.spacing.xxl,
					borderWidth: variant === 'outline' ? 1 : 0,
					borderColor: ds.accent.primary,
				},
				style,
			]}>
			{loading ? (
				<ActivityIndicator color={textColor} size="small" />
			) : (
				<CText
					variant={textVariant}
					weight="semiBold"
					color={textColor}
					style={customTextStyle}>
					{title}
				</CText>
			)}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	button: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		gap: 8,
	},
});

export default React.memo(CButton);
