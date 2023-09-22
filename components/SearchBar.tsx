import { View, Pressable, TextInput } from 'react-native';
import React from 'react';
import {
  MagnifyingGlassIcon,
  MicrophoneIcon,
} from 'react-native-heroicons/outline';

const SearchBar = () => {
  return (
    <View className='flex-row items-center bg-blue-900 px-5 pt-6 pb-4'>
      <Pressable className='flex-row items-center mx-4 bg-white gap-2 py-3 flex-1 rounded h-12'>
        <MagnifyingGlassIcon size={27} color={'#6C6E8C'} />
        <TextInput
          placeholder='Search Julio'
          placeholderTextColor={'#6C6E8C'}
          className='placeholder:text-base'
        />
      </Pressable>
      <MicrophoneIcon size={30} color={'white'} />
    </View>
  );
};

export default SearchBar;
