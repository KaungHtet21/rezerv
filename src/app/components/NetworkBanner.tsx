import { Ionicons } from '@expo/vector-icons';
import React, { createContext, useContext, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CText } from '~app/common';
import { duration } from '~core/design/animation';
import { useNetworkStatus } from '~core/hooks';

const BANNER_HEIGHT = 36;

type NetworkBannerContextValue = {
	visible: boolean;
	showReconnected: boolean;
};

const NetworkBannerContext = createContext<NetworkBannerContextValue | null>(
	null,
);

export const useNetworkBanner = () => {
	const context = useContext(NetworkBannerContext);
	if (!context) {
		throw new Error('useNetworkBanner must be used within NetworkBannerProvider');
	}
	return context;
};

type NetworkBannerProviderProps = {
	children: React.ReactNode;
};

export const NetworkBannerProvider: React.FC<NetworkBannerProviderProps> = ({
	children,
}) => {
	const insets = useSafeAreaInsets();
	const { showReconnected, visible } = useNetworkStatus();
	const offset = useSharedValue(0);

	useEffect(() => {
		offset.value = withTiming(visible ? BANNER_HEIGHT : 0, {
			duration: duration.normal,
		});
	}, [offset, visible]);

	const contentStyle = useAnimatedStyle(() => ({
		paddingTop: offset.value,
	}));

	const bannerStyle = useAnimatedStyle(() => ({
		height: offset.value,
	}));

	const backgroundColor = showReconnected ? '#1B7A3D' : '#242526';
	const message = showReconnected ? 'Back online' : 'No internet connection';
	const iconName = showReconnected ? 'wifi' : 'cloud-offline-outline';

	return (
		<NetworkBannerContext.Provider value={{ visible, showReconnected }}>
			<View style={styles.root}>
				<Animated.View style={[styles.content, contentStyle]}>
					{children}
				</Animated.View>
				<Animated.View
					pointerEvents="none"
					style={[
						styles.banner,
						{ top: insets.top, backgroundColor },
						bannerStyle,
					]}>
					<View style={styles.bannerInner}>
						<Ionicons name={iconName} size={16} color="#FFFFFF" />
						<CText variant="label" weight="medium" color="#FFFFFF">
							{message}
						</CText>
					</View>
				</Animated.View>
			</View>
		</NetworkBannerContext.Provider>
	);
};

const styles = StyleSheet.create({
	root: {
		flex: 1,
	},
	content: {
		flex: 1,
	},
	banner: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		overflow: 'hidden',
	},
	bannerInner: {
		minHeight: BANNER_HEIGHT,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
	},
});
