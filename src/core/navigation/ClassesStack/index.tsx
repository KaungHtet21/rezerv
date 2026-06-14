import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ClassesScreen from '~app/screens/main/ClassesScreen';
import ClassDetailScreen from '~app/screens/main/ClassDetailScreen';
import BookingNotesScreen from '~app/screens/main/BookingNotesScreen';
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
