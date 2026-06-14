import { useColor } from '~shared/presentation/theme/useColor';
import type { AppColors } from '~shared/presentation/theme/theme';

export function useColors(): AppColors {
	return useColor();
}
