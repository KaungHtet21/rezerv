import React from 'react';
import {
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	RefreshControl,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
	ViewStyle,
} from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useKeyboardFooterInset } from '~shared/presentation/hooks';
import CBackground from './CBackground';
import CHeader from './CHeader';
import IconComp from './IconComp';
import { iconSize, spacing, useColors } from '~shared/presentation/design';

type CScreenProps = {
	children: React.ReactNode;
	footer?: React.ReactNode;
	isLoading?: boolean;
	hasHeader?: boolean;
	headerTitle?: string;
	headerRight?: React.ReactNode;
	onBack?: () => void;
	canGoBack?: boolean;
	isScroll?: boolean;
	scrollViewRef?: React.RefObject<ScrollView | null>;
	contentContainerStyle?: ViewStyle;
	style?: ViewStyle;
	contentStyle?: ViewStyle;
	footerStyle?: ViewStyle;
	isFull?: boolean;
	isTabScreen?: boolean;
	onRefresh?: () => Promise<void> | void;
	keyboardAware?: boolean;
	edges?: ('top' | 'bottom' | 'left' | 'right')[];
	statusBarStyle?: 'light-content' | 'dark-content';
	entering?: boolean;
};

const CScreen: React.FC<CScreenProps> = ({
	children,
	footer,
	isLoading = false,
	hasHeader = false,
	headerTitle,
	headerRight,
	onBack,
	canGoBack = false,
	isScroll = false,
	scrollViewRef,
	contentContainerStyle,
	style,
	contentStyle,
	footerStyle,
	isFull = false,
	isTabScreen = false,
	onRefresh,
	keyboardAware = true,
	edges = ['top', 'bottom'],
	statusBarStyle,
	entering = false,
}) => {
	const colors = useColors();
	const navigation = useNavigation<any>();
	const insets = useSafeAreaInsets();
	const bottomInset = isTabScreen ? 0 : insets.bottom;
	const footerBottom = useKeyboardFooterInset(0);
	const [refreshing, setRefreshing] = React.useState(false);
	const [footerHeight, setFooterHeight] = React.useState(0);

	const horizontalPadding = isFull || hasHeader ? 0 : spacing.lg;

	const onRefreshScreen = React.useCallback(async () => {
		if (!onRefresh) return;
		setRefreshing(true);
		try {
			await onRefresh();
		} finally {
			setRefreshing(false);
		}
	}, [onRefresh]);

	const footerAnimatedStyle = useAnimatedStyle(() => ({
		bottom: footerBottom.value,
	}));

	const handleBack = () => {
		if (onBack) {
			onBack();
			return;
		}
		if (navigation.canGoBack()) {
			navigation.goBack();
		}
	};

	const showInlineBack = canGoBack && !hasHeader;

	const scrollBottomPadding = footer ? footerHeight + spacing.lg : 0;

	const content = isScroll ? (
		<ScrollView
			ref={scrollViewRef}
			style={styles.scrollView}
			contentContainerStyle={[
				styles.scrollContent,
				{ paddingHorizontal: horizontalPadding, paddingBottom: scrollBottomPadding },
				contentContainerStyle,
			]}
			keyboardShouldPersistTaps="handled"
			keyboardDismissMode="on-drag"
			showsVerticalScrollIndicator={false}
			nestedScrollEnabled
			refreshControl={
				onRefresh ? (
					<RefreshControl refreshing={refreshing} onRefresh={onRefreshScreen} />
				) : undefined
			}>
			{showInlineBack ? (
				<TouchableOpacity
					activeOpacity={0.7}
					style={styles.inlineBack}
					hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
					onPress={handleBack}>
					<IconComp
						name="chevron-back"
						size={iconSize.md}
						color={colors.title}
					/>
				</TouchableOpacity>
			) : null}
			{children}
		</ScrollView>
	) : (
		<View
			style={[
				styles.content,
				{ paddingHorizontal: horizontalPadding },
				contentStyle,
			]}>
			{showInlineBack ? (
				<TouchableOpacity
					activeOpacity={0.7}
					style={styles.inlineBack}
					hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
					onPress={handleBack}>
					<IconComp
						name="chevron-back"
						size={iconSize.md}
						color={colors.title}
					/>
				</TouchableOpacity>
			) : null}
			{children}
		</View>
	);

	const body = (
		<View style={[styles.body, style]}>
			{hasHeader ? (
				<CHeader
					title={headerTitle}
					rightComponent={headerRight}
					onBack={onBack}
					canGoBack={canGoBack}
				/>
			) : null}

			<KeyboardAvoidingView
				style={styles.flex1}
				behavior={
					keyboardAware && Platform.OS === 'ios' && !footer ? 'padding' : undefined
				}
				keyboardVerticalOffset={hasHeader ? 56 : 0}>
				<View style={styles.flex1}>{content}</View>

				{footer ? (
					<Animated.View
						onLayout={event => {
							setFooterHeight(event.nativeEvent.layout.height);
						}}
						style={[
							styles.footer,
							{
								backgroundColor: colors.background,
								paddingBottom: bottomInset,
							},
							footerAnimatedStyle,
							footerStyle,
						]}>
						{footer}
					</Animated.View>
				) : null}
			</KeyboardAvoidingView>
		</View>
	);

	const root = entering ? (
		<Animated.View entering={FadeInDown.duration(300)} style={styles.flex1}>
			{body}
		</Animated.View>
	) : (
		body
	);

	const safeAreaEdges = React.useMemo(() => {
		let resolved = edges;
		if (footer || isTabScreen) {
			resolved = resolved.filter(edge => edge !== 'bottom');
		}
		return resolved;
	}, [edges, footer, isTabScreen]);

	return (
		<CBackground edges={safeAreaEdges} statusBarStyle={statusBarStyle}>
			{root}
			{isLoading ? (
				<View style={styles.loadingOverlay} pointerEvents="auto">
					<ActivityIndicator size="large" color={colors.primary} />
				</View>
			) : null}
		</CBackground>
	);
};

const styles = StyleSheet.create({
	flex1: {
		flex: 1,
	},
	body: {
		flex: 1,
	},
	content: {
		flex: 1,
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
	},
	inlineBack: {
		alignSelf: 'flex-start',
		paddingTop: spacing.lg,
		marginBottom: spacing.sm,
	},
	footer: {
		position: 'absolute',
		left: 0,
		right: 0,
		backgroundColor: 'transparent',
	},
	loadingOverlay: {
		...StyleSheet.absoluteFill,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.12)',
	},
});

export default React.memo(CScreen);
