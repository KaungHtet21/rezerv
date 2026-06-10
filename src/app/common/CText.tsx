import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { useDesign } from '~core/design';
import type { FontSizeToken, FontWeight } from '~core/design';

interface CTextProps extends TextProps {
	variant?: FontSizeToken;
	weight?: FontWeight;
	color?: string;
	align?: TextStyle['textAlign'];
	opacity?: number;
	children?: React.ReactNode;
}

const CText: React.FC<CTextProps> = ({
	variant = 'body',
	weight,
	color: colorProp,
	align,
	opacity,
	style,
	children,
	...rest
}) => {
	const ds = useDesign();
	const textStyle = ds.textStyle(variant, weight);

	return (
		<Text
			style={[
				textStyle,
				{
					color: colorProp ?? ds.colors.title,
					textAlign: align,
					opacity,
				},
				style,
			]}
			{...rest}>
			{children}
		</Text>
	);
};

export default React.memo(CText);
