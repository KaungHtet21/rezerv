import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AuthStackParamList } from './config/types';
import MainScreen from '~app/screens/main/MainScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => (
	<Stack.Navigator screenOptions={{ headerShown: false }}>
		<Stack.Screen name="MainScreen" component={MainScreen} />
	</Stack.Navigator>
);

export default AuthStack;
