import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useColors, useAccent, spacing } from '~core/design';
import { CText } from '~app/common';

type AuthFooterWithLinkProps = {
	message: string;
	linkText: string;
	navigateTo: string;
};

export const AuthFooterWithLink: React.FC<AuthFooterWithLinkProps> = ({
	message,
	linkText,
	navigateTo,
}) => {
	const colors = useColors();
	const accent = useAccent();
	const navigation = useNavigation<any>();

	return (
		<View
			style={[
				styles.footer,
				{
					borderTopColor: colors.border,
					backgroundColor: colors.background,
					paddingHorizontal: spacing.lg,
					paddingTop: spacing.md,
				},
			]}>
			<CText variant="label" align="center">
				{message}{' '}
				<CText
					variant="label"
					weight="semiBold"
					color={accent.primary} 
					onPress={() => navigation.navigate(navigateTo)}>
					{linkText}
				</CText>
			</CText>
		</View>
	);
};

const styles = StyleSheet.create({
	footer: {
		borderTopWidth: StyleSheet.hairlineWidth,
		justifyContent: 'center',
		alignItems: 'center'
	},
});
