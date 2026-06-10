import { useColor } from '~core/theme/useColor';
import type { AppColors } from '~core/theme/theme';

export function useColors(): AppColors {
	return useColor();
}
