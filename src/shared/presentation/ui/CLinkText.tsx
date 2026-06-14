import React from 'react';
import { TextStyle } from 'react-native';
import { useAccent } from '~shared/presentation/design';
import type { FontSizeToken, FontWeight } from '~shared/presentation/design';
import CText from './CText';

type CLinkTextProps = {
	label: string;
	onPress: () => void;
	variant?: FontSizeToken;
	weight?: FontWeight;
	style?: TextStyle;
};

const CLinkText: React.FC<CLinkTextProps> = ({
	label,
	onPress,
	variant = 'label',
	weight = 'semiBold',
	style,
}) => {
	const accent = useAccent();

	return (
		<CText
			variant={variant}
			weight={weight}
			color={accent.primary}
			onPress={onPress}
			style={style}>
			{label}
		</CText>
	);
};

export default React.memo(CLinkText);
