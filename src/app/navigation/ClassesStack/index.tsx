import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ClassesScreen from '~domains/scheduling/presentation/screens/ClassesScreen';
import ClassDetailScreen from '~domains/scheduling/presentation/screens/ClassDetailScreen';
import BookingNotesScreen from '~domains/scheduling/presentation/screens/BookingNotesScreen';
import type { ClassesStackParamList } from '../config/types';

const Stack = createNativeStackNavigator<ClassesStackParamList>();

const ClassesStack = () => (
	<Stack.Navigator screenOptions={{ headerShown: false }}>
		<Stack.Screen name="ClassesList" component={ClassesScreen} />
		<Stack.Screen name="ClassDetail" component={ClassDetailScreen} />
		<Stack.Screen name="BookingNotes" component={BookingNotesScreen} />
	</Stack.Navigator>
);

export default ClassesStack;
