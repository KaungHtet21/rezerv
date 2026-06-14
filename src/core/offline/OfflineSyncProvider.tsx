import React, { useEffect, useRef } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useAppDispatch } from '~core/store/hooks';
import { isNetInfoOnline } from '~core/offline/network';
import { triggerOfflineSyncIfNeeded, reapplyOfflineQueueToCache } from '~core/offline/offlineActions';
import { setNetworkStatus } from '~core/store/slices/offlineSlice';

type OfflineSyncProviderProps = {
	children: React.ReactNode;
};

export const OfflineSyncProvider: React.FC<OfflineSyncProviderProps> = ({
	children,
}) => {
	const dispatch = useAppDispatch();
	const wasOfflineRef = useRef(false);

	useEffect(() => {
		const handleNetworkChange = (online: boolean) => {
			dispatch(setNetworkStatus(online));

			if (online) {
				if (wasOfflineRef.current) {
					triggerOfflineSyncIfNeeded();
				}
				wasOfflineRef.current = false;
				return;
			}

			wasOfflineRef.current = true;
		};

		const unsubscribe = NetInfo.addEventListener(state => {
			handleNetworkChange(isNetInfoOnline(state));
		});

		NetInfo.fetch().then(state => {
			handleNetworkChange(isNetInfoOnline(state));
			reapplyOfflineQueueToCache();
			triggerOfflineSyncIfNeeded();
		});

		return unsubscribe;
	}, [dispatch]);

	return <>{children}</>;
};
