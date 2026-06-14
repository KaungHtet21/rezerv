import { useEffect, useRef, useState } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

const RECONNECTED_DURATION_MS = 3000;

function isOnline(state: NetInfoState): boolean {
	return state.isConnected === true && state.isInternetReachable !== false;
}

export function useNetworkStatus() {
	const [isConnected, setIsConnected] = useState<boolean | null>(null);
	const [showReconnected, setShowReconnected] = useState(false);
	const wasOfflineRef = useRef(false);

	useEffect(() => {
		const handleState = (state: NetInfoState) => {
			const online = isOnline(state);

			if (online) {
				if (wasOfflineRef.current) {
					setShowReconnected(true);
					wasOfflineRef.current = false;
				}
			} else if (state.isConnected === false) {
				wasOfflineRef.current = true;
				setShowReconnected(false);
			}

			setIsConnected(online);
		};

		const unsubscribe = NetInfo.addEventListener(handleState);
		NetInfo.fetch().then(handleState);

		return unsubscribe;
	}, []);

	useEffect(() => {
		if (!showReconnected) return;

		const timer = setTimeout(() => {
			setShowReconnected(false);
		}, RECONNECTED_DURATION_MS);

		return () => clearTimeout(timer);
	}, [showReconnected]);

	return {
		isConnected,
		isOffline: isConnected === false,
		showReconnected,
		visible: isConnected === false || showReconnected,
	};
}
