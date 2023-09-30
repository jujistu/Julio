import React, { FC } from 'react';
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
import ProductInfoScreen from '../screens/ProductInfoScreen';
import store from '../redux/store/Store';
import { Provider } from 'react-redux';
import { ModalPortal } from 'react-native-modals';
import AddAddress from '../screens/AddAddress';
import Address from '../screens/Address';
import { UserContext } from '../context/UserContext';
import ConfirmationScreen from '../screens/ConfirmationScreen';
import OrderScreen from '../screens/OrderScreen';
import PayStack from '../screens/Flutterwave';
import Flutterwave from '../screens/Flutterwave';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabStackParamList>();

const BottomTabs = () => {
  return (
    <Tab.Navigator initialRouteName='Home'>
      <Tab.Screen
        name='Home'
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarLabelStyle: { color: 'rgba(30 58 138/1)' },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <HomeSolid color='rgba(30 58 138/1)' />
            ) : (
              <HomeOutline color='rgba(96 165 250/1)' />
            ),
        }}
      />
      <Tab.Screen
        name='Profile'
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarLabelStyle: { color: 'rgba(30 58 138/1)' },
          tabBarIcon: ({ focused }) =>
            focused ? (
              <UserSolid color='rgba(30 58 138/1)' />
            ) : (
              <UserOutline color='rgba(96 165 250/1)' />
            ),
        }}
      />
      <Tab.Screen
        name='Cart'
        component={CartScreen}
        options={{
          tabBarLabel: 'Cart',
          tabBarLabelStyle: { color: 'rgba(30 58 138/1)' },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <ShoppingSolid color='rgba(30 58 138/1)' />
            ) : (
              <ShoppingOutline color='rgba(96 165 250/1)' />
            ),
        }}
      />
    </Tab.Navigator>
  );
};

const StackNavigation: FC = () => {
  return (
    <Provider store={store}>
      <UserContext>
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
              <Stack.Screen
                name='ProductInfo'
                component={ProductInfoScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name='Address'
                component={AddAddress}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name='AddAddress'
                component={Address}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name='Confirmation'
                component={ConfirmationScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name='OrderScreen'
                component={OrderScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name='FlutterPay'
                component={Flutterwave}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </ToastProvider>
        <ModalPortal />
      </UserContext>
    </Provider>
  );
};

export default StackNavigation;
