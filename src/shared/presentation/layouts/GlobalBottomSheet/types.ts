export interface PaginatedSheetProps {
  data: any[];
  onSelect: (selectedItems: any[]) => void;
  onClose?: () => void;
  labelKey: string;
  valueKey: string;
  title: string;
  count?: number;
  initialSelectedItems?: any[];
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  /** Show skeleton when true and data is empty */
  isLoading?: boolean;
}

export type GlobalBottomSheetContent =
  | { type: "scroll"; content: React.ReactNode }
  | { type: "paginated"; props: PaginatedSheetProps }
  | null;
