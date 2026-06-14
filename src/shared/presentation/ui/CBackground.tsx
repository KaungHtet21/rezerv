import React from 'react';
import { View, StyleSheet, StatusBar, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDesign } from '~shared/presentation/design';

interface CBackgroundProps {
	children: React.ReactNode;
	style?: ViewStyle;
	edges?: ('top' | 'bottom' | 'left' | 'right')[];
	statusBarStyle?: 'light-content' | 'dark-content';
}

const CBackground: React.FC<CBackgroundProps> = ({
	children,
	style,
	edges = ['top'],
	statusBarStyle,
}) => {
	const ds = useDesign();
	const insets = useSafeAreaInsets();

	const paddingTop = edges.includes('top') ? insets.top : 0;
	const paddingBottom = edges.includes('bottom') ? insets.bottom : 0;
	const paddingLeft = edges.includes('left') ? insets.left : 0;
	const paddingRight = edges.includes('right') ? insets.right : 0;

	return (
		<View
			style={[
				styles.container,
				{
					backgroundColor: ds.colors.background,
					paddingTop,
					paddingBottom,
					paddingLeft,
					paddingRight,
				},
				style,
			]}>
			<StatusBar
				barStyle={statusBarStyle || (ds.isDark ? 'light-content' : 'dark-content')}
				backgroundColor="transparent"
				translucent
			/>
			{children}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

export default React.memo(CBackground);
