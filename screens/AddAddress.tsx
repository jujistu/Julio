import {
  View,
  Text,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import React, { FC, useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import { ChevronRightIcon } from 'react-native-heroicons/mini';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useUserContext } from '../context/UserContext';
import axios from 'axios';
import { MapPinIcon } from 'react-native-heroicons/solid';

type Props = NativeStackScreenProps<RootStackParamList, 'Address'>;

const AddAddress: FC<Props> = ({ navigation }) => {
  const [addresses, setAddresses] = useState<any>([]);

  const { setUserId, userId } = useUserContext();

  //fetch address
  const fetchAddresses = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/addresses/${userId}`
      );

      const { addresses } = response.data;

      setAddresses(addresses);
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // console.log('address', addresses);
  // console.log('user', userId);
  return (
    <ScrollView showsVerticalScrollIndicator={false} className='mt-14'>
      <SearchBar />

      <View className='p-2.5'>
        <Text className='text-xl font-bold tracking-wide'>Your Addresses</Text>

        <Pressable
          onPress={() => {
            navigation.navigate('AddAddress');
          }}
          className='flex-row items-center justify-between mt-2.5 border-gray-300 border-y py-2 px-1.5 '
        >
          <Text>Add a new Address</Text>
          <ChevronRightIcon color='black' />
        </Pressable>

        {/* all added address  */}
        <Pressable>
          {addresses.map((item: any, index: number) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.6}
              className='border border-gray-300 p-2.5 flex-col gap-1 my-2.5'
            >
              <View className='flex-row items-center gap-1'>
                <Text className='text-base tracking-wide font-bold'>
                  {item?.name}
                </Text>
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
            </TouchableOpacity>
          ))}
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default AddAddress;
