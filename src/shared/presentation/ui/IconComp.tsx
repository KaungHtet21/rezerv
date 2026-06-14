import React from 'react';
import { Ionicons } from '@expo/vector-icons';

type Props = {
	name: React.ComponentProps<typeof Ionicons>['name'];
	size?: number;
	color?: string;
};

const IconComp: React.FC<Props> = ({ name, size = 24, color = '#000' }) => (
	<Ionicons name={name} size={size} color={color} />
);

export default React.memo(IconComp);
