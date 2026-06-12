import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { IconComp } from '~app/common';
import ClassesStack from '~core/navigation/ClassesStack';
import ProfileScreen from '~app/screens/main/ProfileScreen';
import { iconSize, useAccent, useColors } from '~core/design';
import type { BottomTabParamList } from '../config/types';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabs = () => {
	const colors = useColors();
	const accent = useAccent();

	return (
		<Tab.Navigator
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: accent.primary,
				tabBarInactiveTintColor: colors.placeholder,
				tabBarStyle: {
					backgroundColor: colors.card,
					borderTopColor: colors.border,
				},
				tabBarLabelStyle: {
					fontSize: 12,
					fontWeight: '600',
				},
			}}>
			<Tab.Screen
				name="Classes"
				component={ClassesStack}
				options={{
					tabBarIcon: ({ color, size }) => (
						<IconComp name="calendar-outline" size={size ?? iconSize.md} color={color} />
					),
				}}
			/>
			<Tab.Screen
				name="Profile"
				component={ProfileScreen}
				options={{
					tabBarIcon: ({ color, size }) => (
						<IconComp name="person-outline" size={size ?? iconSize.md} color={color} />
					),
				}}
			/>
		</Tab.Navigator>
	);
};

export default BottomTabs;
