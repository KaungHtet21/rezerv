export const duration = {
	instant: 100,
	fast: 200,
	normal: 300,
	slow: 400,
	slower: 600,
} as const;

export const spring = {
	snappy: { damping: 20, stiffness: 300, mass: 0.8 },
	default: { damping: 15, stiffness: 150, mass: 1 },
	bouncy: { damping: 10, stiffness: 120, mass: 1 },
	gentle: { damping: 20, stiffness: 100, mass: 1.2 },
} as const;

export type DurationKey = keyof typeof duration;
export type SpringKey = keyof typeof spring;
