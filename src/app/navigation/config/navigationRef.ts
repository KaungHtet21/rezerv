import { createNavigationContainerRef } from '@react-navigation/native';
import type { UnauthStackParamList, AuthStackParamList } from './types';

export type AppParamList = UnauthStackParamList & AuthStackParamList;

export const navigationRef = createNavigationContainerRef<AppParamList>();
