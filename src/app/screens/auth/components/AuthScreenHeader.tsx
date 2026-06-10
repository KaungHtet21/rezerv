import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useColors, useAccent, spacing, iconSize } from '~core/design';
import { CText, IconComp } from '~app/common';

export const AuthScreenHeader: React.FC = () => {
	const colors = useColors();
	const accent = useAccent();
	const navigation = useNavigation<any>();
	const canGoBack = navigation.canGoBack();

	return (
		<View style={styles.header}>
			<View style={styles.headerSpacer}>
				{!canGoBack ? (
					<CText variant="title" weight="bold" color={accent.primary}>
						Rezerv
					</CText>
				) : null}
			</View>
			<View style={styles.headerSpacer}>
				{canGoBack ? (
					<TouchableOpacity
						activeOpacity={0.7}
						hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
						onPress={() => navigation.goBack()}>
						<IconComp
							name="close"
							size={iconSize.md}
							color={colors.title}
						/>
					</TouchableOpacity>
				) : null}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	headerSpacer: {
		minWidth: 40,
		alignItems: 'center',
	},
});
