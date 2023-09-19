import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { ToastProvider } from 'react-native-toast-notifications';
const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigation = () => {
  return (
    <ToastProvider swipeEnabled={true} placement='top' offset={30}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name='Login'
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='Register'
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ToastProvider>
  );
};

export default StackNavigation;
