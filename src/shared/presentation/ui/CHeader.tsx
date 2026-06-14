import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CText, IconComp } from '~shared/presentation/ui';
import { iconSize, spacing, useColors } from '~shared/presentation/design';

type CHeaderProps = {
	title?: string;
	rightComponent?: React.ReactNode;
	onBack?: () => void;
	canGoBack?: boolean;
	style?: ViewStyle;
};

const CHeader: React.FC<CHeaderProps> = ({
	title,
	rightComponent,
	onBack,
	canGoBack = false,
	style,
}) => {
	const colors = useColors();
	const navigation = useNavigation<any>();

	const handleBack = () => {
		if (onBack) {
			onBack();
			return;
		}
		if (navigation.canGoBack()) {
			navigation.goBack();
		}
	};

	return (
		<View style={[styles.header, style]}>
			<View style={styles.side}>
				{canGoBack ? (
					<TouchableOpacity
						activeOpacity={0.7}
						hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
						onPress={handleBack}>
						<IconComp
							name="chevron-back"
							size={iconSize.md}
							color={colors.title}
						/>
					</TouchableOpacity>
				) : null}
			</View>

			<View style={styles.center}>
				{title ? (
					<CText variant="subtitle" weight="semiBold" numberOfLines={1}>
						{title}
					</CText>
				) : null}
			</View>

			<View style={[styles.side, styles.sideRight]}>{rightComponent}</View>
		</View>
	);
};

const styles = StyleSheet.create({
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		minHeight: 44,
		paddingHorizontal: spacing.lg,
		paddingVertical: spacing.sm,
	},
	side: {
		width: 40,
		alignItems: 'flex-start',
		justifyContent: 'center',
	},
	sideRight: {
		alignItems: 'flex-end',
	},
	center: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: spacing.sm,
	},
});

export default React.memo(CHeader);
