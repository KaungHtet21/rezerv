import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type UnauthStackParamList = {
	LoginScreen: { prefillEmail?: string } | undefined;
	RegisterScreen: undefined;
	VerifyEmailScreen: { email: string };
};

export type BottomTabParamList = {
	Classes: undefined;
	Profile: undefined;
};

export type ClassesStackParamList = {
	ClassesList: undefined;
	ClassDetail: {
		classId: string;
		className: string;
		instructor: string;
		timeLabel: string;
		attendanceLabel: string;
	};
	BookingNotes: {
		classId: string;
		bookingId: string;
		attendeeName: string;
	};
};

export type AuthStackParamList = {
	MainTabs: undefined;
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
