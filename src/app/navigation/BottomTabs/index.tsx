import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { IconComp } from '~shared/presentation/ui';
import ClassesStack from '~app/navigation/ClassesStack';
import ProfileScreen from '~domains/profile/presentation/screens/ProfileScreen';
import { iconSize, useAccent, useColors } from '~shared/presentation/design';
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
