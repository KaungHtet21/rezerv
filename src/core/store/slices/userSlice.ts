import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AuthUser = {
	_id: string;
	email: string;
	name?: string;
};

type LoginPayload = {
	user: AuthUser;
	access_token: string;
};

const initialState = {
	token: null as string | null,
	user: null as AuthUser | null,
};

export const usersSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		loginData(state, { payload }: PayloadAction<LoginPayload>) {
			state.user = payload.user;
			state.token = payload.access_token;
		},
		editUser(state, { payload }: PayloadAction<Partial<AuthUser>>) {
			if (state.user) {
				state.user = { ...state.user, ...payload };
			}
		},
		userLogout(state) {
			state.user = null;
			state.token = null;
		},
	},
});

export const { loginData, userLogout, editUser } = usersSlice.actions;
export default usersSlice.reducer;
