import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { UnauthStackParamList } from '../config/types';
import LoginScreen from '~domains/auth/presentation/screens/LoginScreen';
import RegisterScreen from '~domains/auth/presentation/screens/RegisterScreen';
import VerifyEmailScreen from '~domains/auth/presentation/screens/VerifyEmailScreen';

const Stack = createNativeStackNavigator<UnauthStackParamList>();

const UnAuthStack = () => (
	<Stack.Navigator
		initialRouteName="LoginScreen"
		screenOptions={{ headerShown: false }}>
		<Stack.Screen name="LoginScreen" component={LoginScreen} />
		<Stack.Screen name="RegisterScreen" component={RegisterScreen} />
		<Stack.Screen name="VerifyEmailScreen" component={VerifyEmailScreen} />
	</Stack.Navigator>
);

export default UnAuthStack;
