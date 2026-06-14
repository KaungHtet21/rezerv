import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AuthStackParamList } from './config/types';
import BottomTabs from './BottomTabs';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => (
	<Stack.Navigator screenOptions={{ headerShown: false }}>
		<Stack.Screen name="MainTabs" component={BottomTabs} />
	</Stack.Navigator>
);

export default AuthStack;
