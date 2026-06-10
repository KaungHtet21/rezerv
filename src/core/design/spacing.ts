export const spacing = {
	none: 0,
	xxs: 2,
	xs: 4,
	sm: 8,
	md: 12,
	lg: 16,
	xl: 20,
	xxl: 24,
	xxxl: 32,
	huge: 40,
	massive: 48,
	giant: 64,
} as const;

export type SpacingKey = keyof typeof spacing;

export const SCREEN_PADDING_H = spacing.xxl;
export const CARD_PADDING = spacing.lg;
export const LIST_ITEM_GAP = spacing.sm;
