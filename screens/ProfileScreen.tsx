import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import React, { FC, useEffect, useLayoutEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, TabStackParamList } from '../navigation/types';
import { MagnifyingGlassIcon, BellIcon } from 'react-native-heroicons/outline';
import { useUserContext } from '../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { fetchOrders } from '../hooks/Helpers';
import LottieView from 'lottie-react-native';

type Prop = NativeStackScreenProps<TabStackParamList, 'Profile'>;

type LoginProp = NativeStackScreenProps<RootStackParamList, 'Login'>;

const ProfileScreen: FC<Prop> = ({ navigation }) => {
  const rootNav = useNavigation<LoginProp['navigation']>();

  const [orders, setOrders] = useState<any>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const { user, userId } = useUserContext();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerStyle: { backgroundColor: '#fffcf2' },
      headerLeft: () => (
        <Image
          style={{ resizeMode: 'cover' }}
          className='w-[200] h-[110] mb-3.5'
          source={{
            uri: 'https://i.ibb.co/D4LWwCP/julio-logo-removebg-preview.png',
          }}
        />
      ),
      headerRight: () => (
        <View className='flex-row items-center gap-2 mr-5'>
          <BellIcon size={24} color='black' />
          <MagnifyingGlassIcon size={24} color='black' />
        </View>
      ),
    });
  }, []);

  const clearAuthToken = async () => {
    await AsyncStorage.removeItem('authToken');
    console.log('auth token cleared');
    rootNav.replace('Login');
  };

  const logout = () => {
    clearAuthToken();
  };

  useEffect(() => {
    fetchOrders(userId, setOrders, setLoading);
  }, [orders]);

  return (
    <ScrollView className='p-2.5 flex-1 bg-white'>
      <Text className='font-bold text-base'>Welcome {user?.name}</Text>

      <View className='flex-row items-center gap-2.5 mt-3'>
        <Pressable className='p-2.5 rounded-3xl flex-1 bg-slate-300'>
          <Text className='text-center font-medium'>Your orders</Text>
        </Pressable>

        <Pressable className='p-2.5 rounded-3xl flex-1 bg-slate-300'>
          <Text className='text-center font-medium'>Your Account</Text>
        </Pressable>
      </View>

      <View className='flex-row items-center gap-2.5 mt-3'>
        {/* <Pressable className='p-2.5 rounded-3xl flex-1 bg-slate-300'>
          <Text className='text-center font-medium'>Buy again</Text>
        </Pressable> */}

        <Pressable
          onPress={logout}
          className='p-2.5 rounded-3xl flex-1 bg-slate-300'
        >
          <Text className='text-center font-medium'>Logout</Text>
        </Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator
            size={40}
            color='blue'
            className='items-center justify-center'
          />
        ) : orders.length > 0 ? (
          orders.map((order: any) => (
            <>
              <Pressable
                className='mt-5 p-4 border rounded-lg border-gray-300 mx-2.5 justify-center items-center'
                key={order._id}
              >
                <Text className='text-base'>
                  Order :
                  <Text className='text-sm font-bold'>
                    {order._id.slice(0, 9) + '..'}
                  </Text>
                </Text>

                {order.products.slice(0, 1)?.map((product: any) => (
                  <View style={{ marginVertical: 10 }} key={product._id}>
                    <Image
                      source={{ uri: product.image }}
                      style={{ width: 100, height: 100, resizeMode: 'contain' }}
                    />
                  </View>
                ))}
              </Pressable>
            </>
          ))
        ) : (
          <View className='mt-10 justify-center items-center'>
            <LottieView
              style={{
                height: 260,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 60,
              }}
              source={require('../assets/animation_ln69sti0.json')}
              autoPlay
              loop={true}
              speed={0.9}
            />
            <Text className='ml-36 mt-5 items-center justify-center text-lg tracking-wide font-semibold'>
              No orders found
            </Text>
          </View>
        )}
      </ScrollView>
    </ScrollView>
  );
};

export default ProfileScreen;
