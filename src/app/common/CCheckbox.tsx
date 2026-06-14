import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useDesign } from '~core/design';
import IconComp from './IconComp';

interface CCheckboxProps {
	checked: boolean;
	style?: ViewStyle;
	size?: number;
}

const CCheckbox: React.FC<CCheckboxProps> = ({
	checked,
	style,
	size = 22,
}) => {
	const ds = useDesign();
	const iconSize = Math.round(size * 0.64);

	return (
		<View
			style={[
				styles.box,
				{
					width: size,
					height: size,
					borderRadius: ds.radius.sm,
					borderColor: checked ? ds.accent.primary : ds.colors.border,
					backgroundColor: checked ? ds.accent.primary : 'transparent',
				},
				style,
			]}>
			{checked ? (
				<IconComp name="checkmark" size={iconSize} color="#FFFFFF" />
			) : null}
		</View>
	);
};

const styles = StyleSheet.create({
	box: {
		borderWidth: 2,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default React.memo(CCheckbox);
