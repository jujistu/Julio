import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, { FC, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import { useUserContext } from '../context/UserContext';
import axios from 'axios';
import { useToast } from 'react-native-toast-notifications';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Prop = NativeStackScreenProps<RootStackParamList, 'AddAddress'>;

const Address: FC<Prop> = ({ navigation }) => {
  const toast = useToast();

  const [name, setName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [city, setCity] = useState('');
  const [houseNo, setHouseNo] = useState('');
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('Nigeria');

  const { setUserId, userId } = useUserContext();

  //to get userID
  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem('authToken');

      if (token) {
        const decodedToken: any = jwtDecode(token);

        const userId = decodedToken.userId;

        setUserId(userId);
      }
    };
    fetchUser();
  }, []);

  // console.log('user', userId);

  const handleAddAddress = () => {
    const address = {
      name,
      mobileNo,
      street,
      houseNo,
      landmark,
      country,
      city,
      postalCode,
    };

    axios
      .post('http://localhost:8000/addresses', { userId, address })
      .then((response) => {
        toast.show(response.data.message, {
          type: 'success',
          duration: 5000,
          animationType: 'zoom-in',
        });
        setName('');
        setMobileNo('');
        setHouseNo('');
        setStreet('');
        setCity('');
        setLandmark('');
        setCountry('Nigeria');
        setPostalCode('');

        setTimeout(() => {
          navigation.goBack();
        }, 500);
      })
      .catch((error) => {
        toast.show('Error adding address', {
          type: 'danger',
          animationType: 'zoom-in',
          duration: 5000,
        });
      });
  };

  return (
    <ScrollView className='mt-14'>
      <View className='h-12 bg-blue-900' />

      <View className='p-2.5'>
        <Text className='text-lg font-bold tracking-wide'>
          Add a new Address
        </Text>

        <View className='my-2.5'>
          <Text className='text-base font-bold tracking-tight'>Country</Text>
          <TextInput
            value={country}
            onChangeText={(text) => setCountry(text)}
            defaultValue='Nigeria'
            placeholderTextColor='grey'
            placeholder='Country'
            className='p-2.5 border-gray-300 border mt-2.5 rounded'
          />
        </View>

        <View className='my-2.5'>
          <Text className='text-base font-bold tracking-tight'>
            Full name (First and Last name)
          </Text>

          <TextInput
            value={name}
            onChangeText={(text) => setName(text)}
            inputMode='text'
            clearButtonMode='always'
            autoCapitalize='words'
            placeholderTextColor='grey'
            placeholder='Enter your name'
            className='p-2.5 border-gray-300 border mt-2.5 rounded'
          />
        </View>

        <View className='my-2.5'>
          <Text className='text-base font-bold tracking-tight'>
            Mobile number
          </Text>

          <TextInput
            value={mobileNo}
            onChangeText={(text) => setMobileNo(text)}
            placeholderTextColor='grey'
            placeholder='Mobile No'
            className='p-2.5 border-gray-300 border mt-2.5 rounded'
            inputMode='tel'
            clearButtonMode='unless-editing'
          />
        </View>
        <View className='my-2.5'>
          <Text className='text-base font-bold tracking-tight'>
            Flat,House No,Building
          </Text>

          <TextInput
            value={houseNo}
            onChangeText={(text) => setHouseNo(text)}
            placeholderTextColor='grey'
            placeholder=''
            className='p-2.5 border-gray-300 border mt-2.5 rounded'
            inputMode='text'
            clearButtonMode='always'
          />
        </View>

        <View className='my-2.5'>
          <Text className='text-base font-bold tracking-tight'>Street</Text>

          <TextInput
            value={street}
            onChangeText={(text) => setStreet(text)}
            placeholderTextColor='grey'
            placeholder=''
            className='p-2.5 border-gray-300 border mt-2.5 rounded'
            inputMode='text'
            clearButtonMode='always'
          />
        </View>

        <View className='my-2.5'>
          <Text className='text-base font-bold tracking-tight'>City</Text>

          <TextInput
            value={city}
            onChangeText={(text) => setCity(text)}
            placeholderTextColor='grey'
            placeholder=''
            className='p-2.5 border-gray-300 border mt-2.5 rounded'
            inputMode='text'
            clearButtonMode='always'
          />
        </View>

        <View className='my-2.5'>
          <Text className='text-base font-bold tracking-tight'>Landmark</Text>

          <TextInput
            value={landmark}
            onChangeText={(text) => setLandmark(text)}
            placeholderTextColor='grey'
            placeholder='Eg near Eko hotel'
            className='p-2.5 border-gray-300 border mt-2.5 rounded'
            inputMode='text'
            clearButtonMode='always'
          />
        </View>

        <View className='my-2.5'>
          <Text className='text-base font-bold tracking-tight'>
            Postal Code
          </Text>

          <TextInput
            value={postalCode}
            onChangeText={(text) => setPostalCode(text)}
            placeholderTextColor='grey'
            placeholder='Enter postal code'
            className='p-2.5 border-gray-300 border mt-2.5 rounded'
            inputMode='text'
            clearButtonMode='always'
          />
        </View>

        {/* add button */}
        <TouchableOpacity
          onPress={handleAddAddress}
          activeOpacity={0.6}
          className='bg-[#3aaef8] p-5 w-3/4 rounded-md justify-center ml-12 items-center mt-5 mb-7'
        >
          <Text className='font-bold tracking-tight text-base'>
            Add Address
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Address;
