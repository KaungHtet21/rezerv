import React from 'react';
import {
	Keyboard,
	Pressable,
	StyleSheet,
	View,
	ViewStyle,
} from 'react-native';
import { useDesign } from '~core/design';
import CText from './CText';
import IconComp from './IconComp';

const getValueByPath = (obj: unknown, path: string) => {
	if (!obj || !path) return undefined;
	return path.split('.').reduce<unknown>((acc, key) => {
		if (acc && typeof acc === 'object') {
			return (acc as Record<string, unknown>)[key];
		}
		return undefined;
	}, obj);
};

export interface CDropdownInputProps {
	label?: string;
	required?: boolean;
	placeholder: string;
	disabled?: boolean;
	value?: unknown;
	onOpen?: () => void;
	isMultiselect?: boolean;
	valueKey?: string;
	showChevron?: boolean;
	selectionCount?: number;
	error?: string;
	size?: 'sm' | 'md' | 'lg';
	containerStyle?: ViewStyle;
	style?: ViewStyle;
}

const CDropdownInput: React.FC<CDropdownInputProps> = ({
	label,
	required = false,
	placeholder,
	disabled = false,
	value,
	onOpen,
	isMultiselect = false,
	valueKey,
	showChevron = true,
	selectionCount,
	error,
	size = 'md',
	containerStyle,
	style,
}) => {
	const ds = useDesign();
	const height = ds.inputHeight[size];
	const inputTextStyle = ds.textStyle('bodyLarge', 'medium');

	const items = (() => {
		if (value == null) return [];
		if (isMultiselect && Array.isArray(value)) return value;
		return Array.isArray(value) ? value : [value];
	})();

	const resolvedSelectionCount = isMultiselect
		? (selectionCount ?? items.length)
		: 0;

	const getLabel = (item: unknown) => {
		if (item == null) return '';
		if (typeof item === 'string' || typeof item === 'number') return String(item);
		if (valueKey) {
			const fromPath = getValueByPath(item, valueKey);
			if (fromPath != null) return String(fromPath);
		}
		if (typeof item === 'object') {
			const record = item as Record<string, unknown>;
			return String(record.label ?? record.value ?? record.name ?? '');
		}
		return String(item);
	};

	const displayText = isMultiselect
		? items.length > 0
			? items.map(getLabel).join(', ')
			: placeholder
		: items.length > 0
			? getLabel(items[0])
			: placeholder;

	const hasValue = items.length > 0;

	return (
		<View style={[{ marginBottom: ds.spacing.lg }, containerStyle]}>
			{label ? (
				<View style={styles.labelRow}>
					<CText
						variant="label"
						weight="medium"
						color={ds.colors.content}
						style={{ marginBottom: ds.spacing.xs, flex: 1 }}>
						{label}
						{required ? (
							<CText variant="label" color={ds.colors.error}>
								{' *'}
							</CText>
						) : null}
					</CText>
					{isMultiselect && resolvedSelectionCount > 0 ? (
						<View
							style={[
								styles.countBadge,
								{
									backgroundColor: ds.colors.primary,
									marginBottom: ds.spacing.xs,
								},
							]}>
							<CText variant="caption" weight="semiBold" color="#FFFFFF">
								{resolvedSelectionCount}
							</CText>
						</View>
					) : null}
				</View>
			) : null}

			<Pressable
				disabled={disabled}
				onPress={() => {
					Keyboard.dismiss();
					onOpen?.();
				}}
				style={[
					styles.input,
					{
						height,
						backgroundColor: ds.colors.inputBackground,
						borderColor: error ? ds.colors.error : ds.colors.border,
						borderRadius: ds.radius.md,
						paddingHorizontal: ds.spacing.lg,
						opacity: disabled ? 0.6 : 1,
					},
					style,
				]}>
				<CText
					variant="body"
					numberOfLines={1}
					color={hasValue && !disabled ? ds.colors.title : ds.colors.placeholder}
					style={[inputTextStyle, styles.valueText]}>
					{displayText}
				</CText>
				{showChevron ? (
					<View style={styles.indicatorSlot} pointerEvents="none">
						<IconComp
							name="chevron-down"
							size={20}
							color={ds.colors.placeholder}
						/>
					</View>
				) : null}
			</Pressable>

			{error ? (
				<CText
					variant="caption"
					color={ds.colors.error}
					style={{ marginTop: ds.spacing.xxs }}>
					{error}
				</CText>
			) : null}
		</View>
	);
};

const styles = StyleSheet.create({
	labelRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	countBadge: {
		minWidth: 22,
		height: 22,
		borderRadius: 11,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 6,
	},
	input: {
		borderWidth: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
	valueText: {
		flex: 1,
		minWidth: 0,
		paddingRight: 28,
	},
	indicatorSlot: {
		position: 'absolute',
		right: 12,
		top: 0,
		bottom: 0,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default React.memo(CDropdownInput);
