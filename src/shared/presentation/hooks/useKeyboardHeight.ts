import { useEffect } from 'react';
import { Keyboard, Platform } from 'react-native';
import {
	cancelAnimation,
	Easing,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';

const KEYBOARD_EASING = Easing.bezier(0.33, 0.01, 0, 1);

function getKeyboardAnimationDuration(duration?: number) {
	if (!duration || duration <= 0) {
		return 250;
	}

	// iOS reports seconds (e.g. 0.25). Android reports 0.
	if (duration < 30) {
		return duration * 1000;
	}

	return duration;
}

/**
 * Drives sticky footer position above the keyboard.
 * Animates `bottom` offset: keyboard height when open, safe-area inset when closed.
 */
export function useKeyboardFooterInset(fallbackBottom: number) {
	const bottom = useSharedValue(fallbackBottom);

	useEffect(() => {
		bottom.value = fallbackBottom;
	}, [bottom, fallbackBottom]);

	useEffect(() => {
		const showEvent =
			Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
		const hideEvent =
			Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

		const showSub = Keyboard.addListener(showEvent, event => {
			cancelAnimation(bottom);
			bottom.value = withTiming(event.endCoordinates.height, {
				duration: getKeyboardAnimationDuration(event.duration),
				easing: KEYBOARD_EASING,
			});
		});

		const hideSub = Keyboard.addListener(hideEvent, event => {
			cancelAnimation(bottom);
			bottom.value = withTiming(fallbackBottom, {
				duration: getKeyboardAnimationDuration(event.duration),
				easing: KEYBOARD_EASING,
			});
		});

		return () => {
			showSub.remove();
			hideSub.remove();
		};
	}, [bottom, fallbackBottom]);

	return bottom;
}
