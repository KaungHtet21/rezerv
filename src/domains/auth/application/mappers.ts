import type { AuthUser, SafeUser } from '../domain';

export const toAuthUser = (user: SafeUser): AuthUser => ({
	_id: user.id,
	email: user.email,
	name: user.name,
});
