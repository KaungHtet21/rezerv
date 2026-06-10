import { useSelector } from 'react-redux';
import type { RootState } from '~core/store/store';

export function useIsDark(): boolean {
	return useSelector((s: RootState) => s.appstore.theme) === 'dark';
}
