import React from 'react';
import { View } from 'react-native';
import { useAccent, spacing } from '~core/design';
import { CText } from '~app/common';

type AuthTitleWithBrandProps = {
	prefix: string;
	suffix?: string;
};

export const AuthTitleWithBrand: React.FC<AuthTitleWithBrandProps> = ({
	prefix,
	suffix = '',
}) => {
	const accent = useAccent();

	return (
		<View style={{ marginBottom: spacing.xl }}>
			<CText variant="subtitle" weight="semiBold">
				{prefix}{' '}
				<CText variant="subtitle" weight="semiBold" color={accent.primary}>
					Rezerv
				</CText>
				{suffix ? ` ${suffix}` : ''}
			</CText>
		</View>
	);
};
