import { View, Text, TouchableOpacity, Image } from 'react-native';
import React, { FC } from 'react';
import { ProductData } from './types';

const ProductItem: FC<ProductData> = ({ item }) => {
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
        <Text className='font-bold text-base'>${item?.price}</Text>
        <Text className='font-bold text-orange-500 mr-4'>
          <Text className='text-xs pb-1'>⭐️</Text>
          {item?.rating?.rate}
        </Text>
      </View>

      {/* cart button */}
      <TouchableOpacity className='bg-[#3AAEF8] p-3 rounded-3xl justify-center items-center mx-2 mt-2'>
        <Text className='text-base font-medium tracking-wide'>Add to cart</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default ProductItem;
