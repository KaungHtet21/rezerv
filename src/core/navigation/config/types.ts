import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type UnauthStackParamList = {
	LoginScreen: { prefillEmail?: string } | undefined;
	RegisterScreen: undefined;
};

export type AuthStackParamList = {
	MainScreen: undefined;
};

export type RootStackParamList = AuthStackParamList;

export type LoginScreenProps = NativeStackScreenProps<
	UnauthStackParamList,
	'LoginScreen'
>;

export type RegisterScreenProps = NativeStackScreenProps<
	UnauthStackParamList,
	'RegisterScreen'
>;
