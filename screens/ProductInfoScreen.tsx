import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, { FC } from 'react';
import SearchBar from '../components/SearchBar';
import { ProductProps } from './HomeScreen';
import { ShareIcon, MapPinIcon } from 'react-native-heroicons/solid';
import { HeartIcon } from 'react-native-heroicons/outline';

const { width } = Dimensions.get('window');
const height = (width * 100) / 100;

const ProductInfoScreen: FC<ProductProps> = ({ route }) => {
  const data = route.params.item;
  console.log(data);
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className='flex-1 bg-white mt-14'
    >
      <SearchBar />

      {/* images carousel */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {data.carouselImages.map((item: string, index: number) => (
          <ImageBackground
            imageStyle={{ resizeMode: 'contain' }}
            style={{ width, height }}
            className={` mt-3`}
            source={{ uri: item }}
            key={index}
          >
            <View className='p-5 items-center justify-between flex-row'>
              <View className='w-10 h-10 rounded-3xl flex-row justify-center items-center bg-red-700'>
                <Text className='text-white text-center font-medium text-xs'>
                  {data.offer}
                </Text>
              </View>

              {/* shareIcon  */}
              <View className='w-10 h-10 rounded-3xl flex-row justify-center items-center bg-slate-300'>
                <ShareIcon color='black' />
              </View>
            </View>

            <View className='w-10 h-10 rounded-3xl flex-row justify-center items-center bg-slate-300 mt-auto ml-5 mb-5'>
              <HeartIcon color='black' />
            </View>
          </ImageBackground>
        ))}
      </ScrollView>

      <View className='p-3'>
        <Text className='font-medium tracking-wider text-base'>
          {data.title}
        </Text>
        <Text className='font-bold text-lg mt-2'>${data.price}</Text>
      </View>

      {/* border  */}
      <View className='h-1 border-2 border-gray-200' />

      <View className='flex-row items-center p-3'>
        <Text>Color: </Text>
        <Text className='font-bold text-base'>{data.color}</Text>
      </View>

      <View className='flex-row items-center p-3'>
        <Text>Size: </Text>
        <Text className='font-bold text-base'>{data.size}</Text>
      </View>

      <View className='h-1 border-2 border-gray-200' />

      <View className='p-3'>
        <Text className='font-bold text-base my-1'>Total: ${data.price}</Text>
        <Text className='text-blue-500 mb-1'>
          FREE delivery Tomorrow by 3 PM.Order within 10hrs 30 mins
        </Text>

        <View className='flex-row my-2 items-center gap-2'>
          <MapPinIcon color='black' size={25} />
          <Text className='font-medium text-base'>
            Deliver to Paschal - Nigeria 100284
          </Text>
        </View>
      </View>

      <Text className='mx-3 font-medium text-green-700'>IN Stock</Text>

      <TouchableOpacity className='bg-[#3AAEF8] p-3 rounded-3xl justify-center items-center mx-2 mt-2'>
        <Text className='text-base font-medium tracking-wide'>Add to Cart</Text>
      </TouchableOpacity>

      <TouchableOpacity className='bg-[#2d87bb] p-3 rounded-3xl justify-center items-center mx-2 mt-2'>
        <Text className='text-base font-medium tracking-wide'>Buy Now</Text>
      </TouchableOpacity>

      <View className='mt-4 mb-4 h-3' />
    </ScrollView>
  );
};

export default ProductInfoScreen;
