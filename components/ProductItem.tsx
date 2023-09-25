import { View, Text, TouchableOpacity, Image } from 'react-native';
import React, { FC, useState } from 'react';
import { ProductData } from './types';
import { useAppDispatch } from '../redux/Hooks';
import { addToCart } from '../redux/CartReducer';
import { useToast } from 'react-native-toast-notifications';

const ProductItem: FC<ProductData> = ({ item }) => {
  const toast = useToast();

  const [addedToCart, setAddedToCart] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const addItemToCart = (item: any) => {
    setAddedToCart(true);
    toast.show('Added to Cart', {
      type: 'success',
      animationType: 'zoom-in',
      duration: 5000,
    });
    dispatch(addToCart(item));
    setTimeout(() => {
      setAddedToCart(false);
    }, 6000);
  };

  const price = item?.price * 970;
  const formattedPrice = price.toLocaleString(undefined, {
    maximumFractionDigits: 1,
  });

  return (
    <TouchableOpacity className='mx-2 my-5' activeOpacity={0.8}>
      <Image
        className='w-48 h-48'
        source={{ uri: item?.image }}
        style={{ objectFit: 'contain' }}
      />

      <Text numberOfLines={1} className='mt-3 w-40 text-base tracking-tighter'>
        {item?.title}
      </Text>

      <View className='flex-row items-center justify-between mt-1'>
        <Text className='font-bold text-base'>₦{formattedPrice}</Text>
        <Text className='font-bold text-orange-500 mr-4'>
          <Text className='text-xs pb-1'>⭐️</Text>
          {item?.rating?.rate}
        </Text>
      </View>

      {/* cart button */}
      <TouchableOpacity
        onPress={() => addItemToCart(item)}
        className='bg-[#3AAEF8] p-3 rounded-3xl justify-center items-center mx-2 mt-2'
      >
        {addedToCart ? (
          <View>
            <Text className='text-base font-medium tracking-wide'>
              Added to Cart
            </Text>
          </View>
        ) : (
          <Text className='text-base font-medium tracking-wide'>
            Add to Cart
          </Text>
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default ProductItem;
