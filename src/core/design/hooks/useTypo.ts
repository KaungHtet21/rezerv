import { useMemo } from 'react';
import { typography, createTextStyle } from '../typography';

export function useTypo() {
	return useMemo(
		() => ({
			typography,
			textStyle: createTextStyle,
		}),
		[],
	);
}
