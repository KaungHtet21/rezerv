import {
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, Keyboard, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '~shared/presentation/design';
import { useGlobalBottomSheet } from './GlobalBottomSheetContext';

const MAX_HEIGHT_RATIO = 0.8;
const PAGINATED_SHEET_HEIGHT_RATIO = 0.9;
const KEYBOARD_SNAP = '85%';

const GlobalBottomSheetView = () => {
	const { content, closeSheet, clearContent, isOpen } = useGlobalBottomSheet();
	const colors = useColors();
	const insets = useSafeAreaInsets();
	const bottomSheetRef = useRef<BottomSheetModal>(null);
	const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

	const useFlatList = content?.useFlatList ?? false;
	const fixedHeight = content?.fixedHeight ?? true;
	const scrollSnapPoint = content?.snapPoint;

	const maxHeight = useMemo(
		() => Math.round(Dimensions.get('window').height * MAX_HEIGHT_RATIO),
		[],
	);

	const paginatedSnapPoints = useMemo(
		() => [Dimensions.get('window').height * PAGINATED_SHEET_HEIGHT_RATIO],
		[],
	);

	const scrollUseDynamicSizing = !scrollSnapPoint && !isKeyboardVisible;
	const scrollSnapPointsWhenFixed = isKeyboardVisible
		? [KEYBOARD_SNAP]
		: scrollSnapPoint
			? [scrollSnapPoint]
			: undefined;

	const flatListSnapPointsResolved = isKeyboardVisible
		? [KEYBOARD_SNAP]
		: paginatedSnapPoints;

	const handleChange = useCallback((index: number) => {
		if (index === -1) {
			bottomSheetRef.current?.dismiss();
		}
	}, []);

	useEffect(() => {
		if (!isOpen) return;

		const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
			setIsKeyboardVisible(true);
			requestAnimationFrame(() => {
				setTimeout(() => {
					bottomSheetRef.current?.expand();
				}, 150);
			});
		});

		const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
			setIsKeyboardVisible(false);
			requestAnimationFrame(() => {
				setTimeout(() => {
					bottomSheetRef.current?.snapToIndex(0);
				}, 100);
			});
		});

		return () => {
			keyboardDidShowListener.remove();
			keyboardDidHideListener.remove();
		};
	}, [isOpen]);

	const renderBackdrop = useCallback(
		(props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
			<BottomSheetBackdrop
				{...props}
				disappearsOnIndex={-1}
				appearsOnIndex={0}
				opacity={0.5}
				pressBehavior="close"
			/>
		),
		[],
	);

	useEffect(() => {
		if (!content) return;

		if (isOpen) {
			bottomSheetRef.current?.present();
		} else {
			bottomSheetRef.current?.dismiss();
			setIsKeyboardVisible(false);
		}
	}, [isOpen, content]);

	useEffect(() => {
		if (content === null) {
			setIsKeyboardVisible(false);
		}
	}, [content]);

	const handleDismiss = useCallback(() => {
		content?.onClose?.();
		clearContent();
		closeSheet();
	}, [content, clearContent, closeSheet]);

	if (content === null) {
		return null;
	}

	const scrollProps = scrollUseDynamicSizing
		? { enableDynamicSizing: true, maxDynamicContentSize: maxHeight }
		: { enableDynamicSizing: false, snapPoints: scrollSnapPointsWhenFixed };

	return (
		<View style={StyleSheet.absoluteFill} pointerEvents="box-none">
			<BottomSheetModal
				ref={bottomSheetRef}
				enableDismissOnClose
				onDismiss={handleDismiss}
				index={0}
				{...(useFlatList
					? fixedHeight || isKeyboardVisible
						? {
								snapPoints: flatListSnapPointsResolved,
								enableDynamicSizing: false,
							}
						: {
								enableDynamicSizing: true,
								maxDynamicContentSize: maxHeight,
							}
					: scrollProps)}
				enablePanDownToClose
				enableOverDrag={false}
				onChange={handleChange}
				handleIndicatorStyle={{
					backgroundColor: colors.border,
					width: 40,
				}}
				backgroundStyle={{ backgroundColor: colors.background }}
				style={styles.sheet}
				keyboardBehavior="extend"
				keyboardBlurBehavior="restore"
				android_keyboardInputMode="adjustResize"
				backdropComponent={renderBackdrop}
				enableContentPanningGesture={!useFlatList}
				enableHandlePanningGesture>
				{useFlatList ? (
					content.content
				) : (
					<BottomSheetScrollView
						contentContainerStyle={[
							styles.content,
							{ paddingBottom: insets.bottom },
						]}
						showsVerticalScrollIndicator={false}
						keyboardShouldPersistTaps="handled">
						{content.content}
					</BottomSheetScrollView>
				)}
			</BottomSheetModal>
		</View>
	);
};

const styles = StyleSheet.create({
	sheet: {
		flex: 1,
	},
	content: {
		flexGrow: 1,
	},
});

export default GlobalBottomSheetView;
