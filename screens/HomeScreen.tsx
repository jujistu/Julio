import {
  View,
  Text,
  SafeAreaView,
  Platform,
  ScrollView,
  Pressable,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { MapPinIcon } from 'react-native-heroicons/outline';
import {
  MapPinIcon as MapPinSolid,
  ViewfinderCircleIcon,
} from 'react-native-heroicons/solid';
import { deals, images, list, offers } from '../utils/Constants';
import { FlatListSlider } from '@kuasha420/react-native-flatlist-slider';
import axios from 'axios';
import ProductItem from '../components/ProductItem';

import DropDownPicker from 'react-native-dropdown-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useNavigation } from '@react-navigation/core';
import SearchBar from '../components/SearchBar';
import { useAppSelector } from '../redux/Hooks';
import {
  Backdrop,
  BottomModal,
  ModalContent,
  SlideAnimation,
} from 'react-native-modals';
import { ChevronDownIcon } from 'react-native-heroicons/mini';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserContext } from '../context/UserContext';
import jwtDecode from 'jwt-decode';

export type ProductProps = NativeStackScreenProps<
  RootStackParamList,
  'ProductInfo'
>;

const ios = Platform.OS === 'ios';

const HomeScreen: FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const navigation = useNavigation<ProductProps['navigation']>();

  const { setUserId, userId } = useUserContext();

  const [selectedAddress, setSelectedAddress] = useState<any>('');

  const [addresses, setAddresses] = useState<any[]>([]);

  const [products, setProducts] = useState<any[]>();
  const [open, setOpen] = useState<boolean>(false);
  const [category, setCategory] = useState<string>('See all');
  const [items, setItems] = useState([
    { label: 'See all', value: 'See all' },
    { label: "Men's clothing", value: "men's clothing" },
    { label: 'Jewelery', value: 'jewelery' },
    { label: 'Electronics', value: 'electronics' },
    { label: "Women's clothing", value: "women's clothing" },
  ]);

  const onOpen = useCallback(() => {
    setOpen(true);
  }, []);

  console.log('select', selectedAddress);

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
    if (userId) {
      fetchAddresses();
    }
  }, [userId, modalVisible]);

  // console.log('address', addresses);

  //Redux
  // const cart = useAppSelector((state) => state.cart.cart);
  // console.log('cart', cart);

  ////
  //fakeStore api
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://fakestoreapi.com/products');

        setProducts(response.data);
      } catch (error) {
        console.log('error products', error);
      }
    };
    fetchData();
  }, []);

  // console.log('products', products);

  return (
    <>
      <SafeAreaView className={`${ios ? 'pt-0' : 'pt-9'} flex-1 bg-white`}>
        <ScrollView>
          {/* search bar  */}
          <SearchBar />

          {/* location picker  */}
          <Pressable
            onPress={() => setModalVisible(!modalVisible)}
            className='flex-row items-center gap-y-1 bg-blue-400 px-3 pt-2 pb-2'
          >
            <MapPinIcon size={29} color={'black'} />
            <Pressable>
              {selectedAddress ? (
                <Text className='font-medium text-base pl-2 pr-1 tracking-tighter'>
                  Deliver to {selectedAddress?.name} - {selectedAddress?.city}{' '}
                  {selectedAddress?.postalCode}{' '}
                </Text>
              ) : (
                <Text className='font-medium text-base pl-2 pr-1 tracking-tighter'>
                  Add an Address
                </Text>
              )}
            </Pressable>
            <ChevronDownIcon color={'black'} size={18} />
          </Pressable>

          {/* categories horizontal */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {list.map((item, index) => (
              <TouchableOpacity
                activeOpacity={0.5}
                key={index}
                className='justify-center items-center mx-2 my-3'
              >
                <Image
                  source={{ uri: item.image }}
                  className='object-cover w-20 h-16 rounded'
                />
                <Text className='text-center text-base font-semibold mt-2'>
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* <SliderBox /> */}
          <FlatListSlider
            images={images}
            width={'window'}
            resizeMode='stretch'
            indicatorSize={8}
            indicatorActiveColor='red'
            indicatorColor='#6C6E8C'
          />

          <Text className='p-2.5 font-bold text-2xl tracking-tighter'>
            Trending Deals of the week
          </Text>

          <View className='flex-row items-center flex-wrap'>
            {deals.map((item, index) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ProductInfo', {
                    id: item.id,
                    title: item.title,
                    price: item.price,
                    oldPrice: item.oldPrice,
                    carouselImages: item.carouselImages,
                    color: item.color,
                    size: item.size,
                    item: item,
                    selectedAddress,
                  })
                }
                key={index}
                className='flex-row items-center my-2'
              >
                <Image
                  style={{ objectFit: 'contain' }}
                  className='w-52 h-48 object-contain'
                  source={{ uri: item.image }}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* borderline */}
          <View className='border-2 border-gray-400 mt-3' />

          {/* today's deals  */}
          <Text className='p-2.5 font-bold text-2xl tracking-tighter'>
            Today's deals
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {offers.map((item, index) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ProductInfo', {
                    id: item.id,
                    title: item.title,
                    price: item.price,
                    oldPrice: item.oldPrice,
                    carouselImages: item.carouselImages,
                    color: item.color,
                    size: item.size,
                    item: item,
                    selectedAddress: selectedAddress,
                  })
                }
                key={index}
                className='items-center justify-center m-3'
              >
                <Image
                  className='w-48 h-48 rounded'
                  style={{ objectFit: 'contain' }}
                  source={{ uri: item.image }}
                />

                <View className='justify-center items-center mt-2 rounded py-2 w-36 bg-slate-900'>
                  <Text className='text-center text-white font-bold text-sm'>
                    up to {item.offer}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View className='border-2 border-gray-400 mt-3' />

          <View className={`mx-2.5 mt-5 w-2/4 ${open ? 'mb-24' : 'mb-5'}`}>
            <DropDownPicker
              itemProps={{ activeOpacity: 0.5 }}
              value={category}
              style={{
                borderColor: '#B7B7B7',
                height: 30,
                marginBottom: open ? 120 : 15,
              }}
              placeholder='Choose category'
              placeholderStyle={{ fontSize: 20, fontWeight: 'bold' }}
              zIndex={3000}
              zIndexInverse={1000}
              setOpen={setOpen}
              setItems={setItems}
              setValue={setCategory}
              items={items}
              open={open}
              onOpen={onOpen}
              labelStyle={{ fontWeight: '500' }}
              textStyle={{ fontSize: 20 }}
            />
          </View>

          <View className='flex-row items-center flex-wrap'>
            {products
              ?.filter((item) => {
                const filteredList = item.category === category;

                const allList = category === 'See all';

                if (filteredList) {
                  return filteredList;
                }

                if (allList) {
                  return item;
                }
              })
              .map((item, index) => (
                <ProductItem item={item} key={index} />
              ))}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* modals */}
      <BottomModal
        onHardwareBackPress={() => modalVisible}
        visible={modalVisible}
        onTouchOutside={() => setModalVisible(!modalVisible)}
        swipeDirection={['up', 'down']}
        swipeThreshold={200}
        modalAnimation={new SlideAnimation({ slideFrom: 'bottom' })}
      >
        <Backdrop
          opacity={0.9}
          visible={modalVisible}
          onPress={() => setModalVisible(!modalVisible)}
        />
        <ModalContent style={{ width: '100%', height: 400 }}>
          <View className='mb-2'>
            <Text className='text-base font-medium'>Choose your location</Text>

            <Text className='mt-1 text-base text-gray-500'>
              Select a delivery location to see product availability and
              delivery options
            </Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {/* already added address */}
            {addresses.map((item, index) => (
              <TouchableOpacity
                onPress={() => setSelectedAddress(item)}
                activeOpacity={0.4}
                key={index}
                className={`h-36 w-36 border-gray-200 mt-2.5 border p-2.5 justify-center items-center mr-3.5 ${
                  selectedAddress === item ? 'bg-orange-300' : 'bg-white'
                }`}
              >
                <View className='flex-row items-center gap-1'>
                  <Text className='text-sm font-bold tracking-wide'>
                    {item?.name}
                  </Text>
                  <MapPinSolid size={22} color='red' />
                </View>

                <Text numberOfLines={1} className='w-32 text-xs text-center'>
                  {item?.houseNo}, {item?.landmark}
                </Text>

                <Text numberOfLines={1} className='w-32 text-xs text-center'>
                  {item?.street}
                </Text>

                <Text numberOfLines={1} className='w-32 text-sm text-center'>
                  {item?.country}, {item?.city}
                </Text>
              </TouchableOpacity>
            ))}

            <Pressable
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('Address');
              }}
              className='h-36 w-36 border-gray-200 mt-2.5 border p-2.5 justify-center items-center'
            >
              <Text className='text-center text-blue-700 font-medium '>
                Add an Address or pick-up point
              </Text>
            </Pressable>
          </ScrollView>

          <View className='flex-column gap-2 mb-7'>
            <View className='flex-row items-center gap-1'>
              <MapPinSolid color='black' size={20} />
              <Text className='text-blue-700 font-normal'>
                Enter a Postal Code
              </Text>
            </View>

            <View className='flex-row items-center gap-1'>
              <ViewfinderCircleIcon color='black' size={20} />
              <Text className='text-blue-700 font-normal'>
                Use my Current location
              </Text>
            </View>
          </View>
        </ModalContent>
      </BottomModal>
    </>
  );
};

export default HomeScreen;
