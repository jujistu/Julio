import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React, { Fragment, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { steps } from '../utils/Constants';
import { fetchAddresses } from '../hooks/Helpers';
import { useUserContext } from '../context/UserContext';
import AddressesView from '../components/AddressesView';
import { faCircle, faCircleDot } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

const ConfirmationScreen = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const [addresses, setAddresses] = useState([]);

  const [selectedAddress, setSelectedAddress] = useState<any>();

  const { setUserId, userId } = useUserContext();

  fetchAddresses(setAddresses, userId);

  return (
    <ScrollView className='mt-14'>
      <View className='flex-1 px-5 pt-10'>
        <View className='flex-row items-center mb-5 justify-between '>
          {steps?.map((step, index) => (
            <View key={index} className='justify-center items-center'>
              {index > 0 && (
                <View
                  className={`flex-1 h-0.5 bg-[#225372d9] ${
                    index <= currentStep && 'bg-[#225372d9]'
                  }`}
                />
              )}
              <View
                className={`w-7 h-7 rounded-2xl  bg-[#225372d9] justify-center items-center ${
                  index < currentStep && 'bg-green-500'
                }`}
              >
                {index < currentStep ? (
                  <Text className='text-base font-bold text-white'>
                    &#10003;
                  </Text>
                ) : (
                  <Text className='text-base font-bold text-white'>
                    {index + 1}
                  </Text>
                )}
              </View>
              <Text className='text-center mt-2'>{step.title}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* step 1 Address  */}
      {currentStep === 0 && (
        <View className='mx-5'>
          <Text className='text-base font-bold'>Select Delivery Address</Text>

          <TouchableOpacity activeOpacity={0.8}>
            {addresses?.map((item: any, index) => (
              <Pressable
                key={index}
                className='border p-2.5 flex-row items-center gap-1.5 pb-4 border-gray-300 my-1.5 rounded-md'
              >
                {/* selecting address  */}
                {selectedAddress && selectedAddress._id === item._id ? (
                  <Pressable>
                    <FontAwesomeIcon
                      icon={faCircleDot}
                      color='#225372d9'
                      size={20}
                    />
                  </Pressable>
                ) : (
                  <Pressable onPress={() => setSelectedAddress(item)}>
                    <FontAwesomeIcon
                      icon={faCircle}
                      color='#225372d9'
                      size={20}
                    />
                  </Pressable>
                )}

                <View className='ml-1.5'>
                  <AddressesView item={item} />
                  <View>
                    {selectedAddress && selectedAddress._id === item._id && (
                      //deliver and move to next step button
                      <Pressable
                        onPress={() => setCurrentStep(1)}
                        className='p-2.5 rounded-3xl mt-2.5 justify-center items-center bg-[#225372d9]'
                      >
                        <Text className='text-center text-base font-normal text-white tracking-wide'>
                          Deliver to this address
                        </Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              </Pressable>
            ))}
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

export default ConfirmationScreen;
