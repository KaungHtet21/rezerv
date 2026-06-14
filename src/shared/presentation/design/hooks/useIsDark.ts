import { useSelector } from 'react-redux';
import type { RootState } from '~shared/infrastructure/state/store';

export function useIsDark(): boolean {
	return useSelector((s: RootState) => s.appstore.theme) === 'dark';
}
