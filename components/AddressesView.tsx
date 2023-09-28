import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import React from 'react';
import { MapPinIcon } from 'react-native-heroicons/solid';

const AddressesView = ({ item }: any) => {
  return (
    <>
      <View className='flex-row items-center gap-1'>
        <Text className='text-base tracking-wide font-bold'>{item?.name}</Text>
        <MapPinIcon size={24} color='red' />
      </View>

      <Text className='text-base text-slate-900 tracking-tight'>
        {item?.houseNo}, {item?.landmark}
      </Text>

      <Text className='text-base text-slate-900'>{item?.street}</Text>

      <Text className='text-base text-slate-900 tracking-wide'>
        {item?.country}, {item?.city}
      </Text>

      <Text className='text-base text-slate-900 tracking-wide'>
        Phone No: {item?.mobileNo}
      </Text>

      <Text className='text-base text-slate-900 tracking-wide'>
        Postal code: {item?.postalCode}
      </Text>

      <View className='flex-row items-center gap-2.5 mt-2'>
        <TouchableOpacity className='bg-white px-2.5 py-1.5 rounded-md border border-gray-200'>
          <Text>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity className='bg-white px-2.5 py-1.5 rounded-md border border-gray-200'>
          <Text>remove</Text>
        </TouchableOpacity>

        <TouchableOpacity className='bg-white px-2.5 py-1.5 rounded-md border border-gray-200'>
          <Text>set as Default</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default AddressesView;
