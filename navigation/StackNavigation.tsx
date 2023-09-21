import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList, TabStackParamList } from './types';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { ToastProvider } from 'react-native-toast-notifications';
import HomeScreen from '../screens/HomeScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  HomeIcon as HomeSolid,
  UserIcon as UserSolid,
  ShoppingCartIcon as ShoppingSolid,
} from 'react-native-heroicons/solid';
import {
  HomeIcon as HomeOutline,
  UserIcon as UserOutline,
  ShoppingCartIcon as ShoppingOutline,
} from 'react-native-heroicons/outline';
import ProfileScreen from '../screens/ProfileScreen';
import CartScreen from '../screens/CartScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabStackParamList>();

const BottomTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name='Home'
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarLabelStyle: { color: '#008E97' },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <HomeSolid color='#008E97' />
            ) : (
              <HomeOutline color='#008E97' />
            ),
        }}
      />
      <Tab.Screen
        name='Profile'
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarLabelStyle: { color: '#008E97' },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <UserSolid color='#008E97' />
            ) : (
              <UserOutline color='#008E97' />
            ),
        }}
      />
      <Tab.Screen
        name='Cart'
        component={CartScreen}
        options={{
          tabBarLabel: 'Cart',
          tabBarLabelStyle: { color: '#008E97' },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <ShoppingSolid color='#008E97' />
            ) : (
              <ShoppingOutline color='#008E97' />
            ),
        }}
      />
    </Tab.Navigator>
  );
};

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
          <Stack.Screen
            name='Main'
            component={BottomTabs}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ToastProvider>
  );
};

export default StackNavigation;
