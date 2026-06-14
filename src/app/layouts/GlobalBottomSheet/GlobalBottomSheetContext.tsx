import React, {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from 'react';

export interface OpenSheetOptions {
	onClose?: () => void;
	/** When true, content uses BottomSheetFlatList — render directly */
	useFlatList?: boolean;
	/** When true (default for useFlatList), sheet uses fixed 90% snap point */
	fixedHeight?: boolean;
	/** Fixed snap for scroll content (avoids keyboard restore bug with TextInput) */
	snapPoint?: string;
}

export type GlobalBottomSheetContent = {
	content: React.ReactNode;
	onClose?: () => void;
	useFlatList?: boolean;
	fixedHeight?: boolean;
	snapPoint?: string;
};

type GlobalBottomSheetContextValue = {
	openSheet: (content: React.ReactNode, options?: OpenSheetOptions) => void;
	closeSheet: () => void;
	clearContent: () => void;
	content: GlobalBottomSheetContent | null;
	isOpen: boolean;
};

const GlobalBottomSheetContext =
	createContext<GlobalBottomSheetContextValue | null>(null);

export const useGlobalBottomSheet = (): GlobalBottomSheetContextValue => {
	const ctx = useContext(GlobalBottomSheetContext);
	if (!ctx) {
		throw new Error(
			'useGlobalBottomSheet must be used within GlobalBottomSheetProvider',
		);
	}
	return ctx;
};

interface GlobalBottomSheetProviderProps {
	children: React.ReactNode;
}

export const GlobalBottomSheetProvider = ({
	children,
}: GlobalBottomSheetProviderProps) => {
	const [content, setContent] = useState<GlobalBottomSheetContent | null>(null);
	const [isOpen, setIsOpen] = useState(false);

	const openSheet = useCallback(
		(newContent: React.ReactNode, options?: OpenSheetOptions) => {
			setContent({
				content: newContent,
				onClose: options?.onClose,
				useFlatList: options?.useFlatList,
				fixedHeight: options?.fixedHeight,
				snapPoint: options?.snapPoint,
			});
			setIsOpen(true);
		},
		[],
	);

	const closeSheet = useCallback(() => {
		setIsOpen(false);
	}, []);

	const clearContent = useCallback(() => {
		setContent(null);
	}, []);

	const value = useMemo<GlobalBottomSheetContextValue>(
		() => ({
			openSheet,
			closeSheet,
			clearContent,
			content,
			isOpen,
		}),
		[openSheet, closeSheet, clearContent, content, isOpen],
	);

	return (
		<GlobalBottomSheetContext.Provider value={value}>
			{children}
		</GlobalBottomSheetContext.Provider>
	);
};
