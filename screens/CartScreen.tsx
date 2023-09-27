import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { FC } from 'react';
import SearchBar from '../components/SearchBar';
import { useAppDispatch, useAppSelector } from '../redux/Hooks';
import { formattedPrice } from '../hooks/Helpers';
import { TrashIcon, PlusIcon, MinusIcon } from 'react-native-heroicons/outline';
import {
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
} from '../redux/CartReducer';
import { RootStackParamList } from '../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

type Prop = NativeStackScreenProps<RootStackParamList, 'Confirmation'>;

const CartScreen: FC = () => {
  const navigation = useNavigation<Prop['navigation']>();

  //Redux
  const cart = useAppSelector((state) => state.cart.cart);
  // console.log('cart', cart);

  const dispatch = useAppDispatch();

  //increase Quantity
  const increaseQuantity = (item: any) => {
    dispatch(incrementQuantity(item));
  };

  //Decrease Quantity
  const decreaseQuantity = (item: any) => {
    dispatch(decrementQuantity(item));
  };

  //Remove from Cart
  const deleteItem = (item: any) => {
    dispatch(removeFromCart(item));
  };

  const total = cart
    ?.map((item) => item.quantity * item.price)
    .reduce((cur, prev) => cur + prev, 0);

  const formattedTotal = formattedPrice(total);

  return (
    <ScrollView className='flex-1 mt-14 bg-white'>
      <SearchBar />

      <View className='p-2.5 flex-row items-center'>
        <Text className='text-lg font-normal'>Subtotal :</Text>
        <Text className='text-xl font-bold'> ₦{formattedTotal}</Text>
      </View>

      <Text className='mx-2.5'>Credit card available</Text>

      <Pressable
        onPress={() => {
          if (cart.length > 0) {
            navigation.navigate('Confirmation');
          }
        }}
        className='bg-[#3aaef8] p-2.5 rounded-md justify-center items-center mx-2.5 mt-2.5'
      >
        <Text className='tracking-tight font-medium'>
          Proceed to Buy ({cart.length}) items
        </Text>
      </Pressable>

      <View className='border mt-4 border-gray-300' />

      {/* cart items  */}
      <View className='mx-2.5'>
        {cart.map((item, index) => (
          <View
            className='bg-white my-2.5 border-b-gray-200 border-b-2'
            key={index}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              className='my-2.5 flex-row justify-around'
            >
              <View>
                <Image
                  className='w-36 h-36'
                  style={{ resizeMode: 'contain' }}
                  source={{ uri: item.image }}
                />
              </View>

              <View>
                <Text numberOfLines={3} className='w-36 mt-2.5'>
                  {item?.title}
                </Text>

                <Text className='text-xl font-bold mt-1.5'>
                  ₦{formattedPrice(item?.price)}
                </Text>

                <Image
                  className='w-9 h-7'
                  style={{ resizeMode: 'stretch' }}
                  source={{
                    uri: 'https://i.ibb.co/D4LWwCP/julio-logo-removebg-preview.png',
                  }}
                />

                <Text className='text-green-700'>In Stock</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity className='mt-4 mb-2.5 flex-row items-center gap-2.5'>
              <View className='flex-row items-center px-2.5 py-1 rounded-md'>
                {item?.quantity > 1 ? (
                  <Pressable
                    onPress={() => decreaseQuantity(item)}
                    className='bg-slate-300 p-2 rounded-bl-md rounded-tl-md'
                  >
                    <MinusIcon size={20} color='black' />
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={() => deleteItem(item)}
                    className='bg-slate-300 p-2 rounded-bl-md rounded-tl-md'
                  >
                    <TrashIcon size={20} color='black' />
                  </Pressable>
                )}

                <Pressable className='bg-white px-4 py-1.5'>
                  <Text>{item?.quantity}</Text>
                </Pressable>

                <Pressable
                  onPress={() => increaseQuantity(item)}
                  className='bg-slate-300 p-2 rounded-bl-md rounded-tl-md'
                >
                  <PlusIcon color='black' size={20} />
                </Pressable>
              </View>

              <Pressable
                onPress={() => deleteItem(item)}
                className='bg-white px-2 py-2.5 rounded-md border border-gray-200'
              >
                <Text>Delete</Text>
              </Pressable>
            </TouchableOpacity>

            <Pressable className='flex-row items-center gap-2.5 mb-4'>
              <Pressable className='bg-white px-2 py-2.5 rounded-md border border-gray-200'>
                <Text>Save for later</Text>
              </Pressable>

              <Pressable className='bg-white px-2 py-2.5 rounded-md border border-gray-200'>
                <Text>See more like this</Text>
              </Pressable>
            </Pressable>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default CartScreen;
