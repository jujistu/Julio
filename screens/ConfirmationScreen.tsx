import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React, { FC, useState } from 'react';
import { steps } from '../utils/Constants';
import { fetchAddresses, formattedPrice } from '../hooks/Helpers';
import { useUserContext } from '../context/UserContext';
import AddressesView from '../components/AddressesView';
import { faCircle, faCircleDot } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { ChevronRightIcon } from 'react-native-heroicons/mini';
import { useAppDispatch, useAppSelector } from '../redux/Hooks';
import axios from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useToast } from 'react-native-toast-notifications';
import { clearCart } from '../redux/CartReducer';
import Dialog from 'react-native-dialog';

type Prop = NativeStackScreenProps<RootStackParamList, 'Confirmation'>;

const ConfirmationScreen: FC<Prop> = ({ navigation }) => {
  const toast = useToast();

  const [showPopUp, setShowPopUp] = useState<boolean>(false);

  const [currentStep, setCurrentStep] = useState<number>(0);

  const [addresses, setAddresses] = useState([]);

  const [option, setOption] = useState<boolean>(false); //for delivery

  const [selectedOption, setSelectedOption] = useState<string>(''); //for payment method

  const { userId, selectedAddress, setSelectedAddress } = useUserContext(); //for address,userId and user details

  fetchAddresses(setAddresses, userId);

  const dispatch = useAppDispatch();

  const cart = useAppSelector((state) => state.cart.cart);

  const total = cart
    ?.map((item) => item.quantity * item.price)
    .reduce((cur, prev) => cur + prev, 0);

  const formattedTotal = formattedPrice(total);

  //Place order button
  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        userId,
        cartItems: cart,
        totalPrice: formattedTotal,
        shippingAddress: selectedAddress,
        paymentMethod: selectedOption,
      };

      const response = await axios.post(
        'http://localhost:8000/orders',
        orderData
      );

      if (response.status === 200) {
        toast.show(response.data.message, {
          type: 'success',
          animationType: 'zoom-in',
          duration: 5000,
        });
        navigation.navigate('OrderScreen');
        dispatch(clearCart());
        setCurrentStep(0);
      } else {
        console.log('error Order', response.data);
      }
    } catch (error) {
      toast.show('Error creating Order', {
        type: 'danger',
        animationType: 'slide-in',
        duration: 6000,
      });
    }
  };

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
                  index < currentStep && 'bg-green-800'
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

      {/* step 2 delivery */}
      {currentStep === 1 && (
        <View className='mx-5'>
          <Text className='text-xl font-bold tracking-tight'>
            Choose your delivery options
          </Text>
          <View className='flex-row items-center bg-white border border-gray-200 p-2 gap-1.5 mt-2.5 mb-2.5'>
            {option ? (
              <Pressable onPress={() => setOption(!option)}>
                <FontAwesomeIcon
                  icon={faCircleDot}
                  color='#225372d9'
                  size={20}
                />
              </Pressable>
            ) : (
              <Pressable onPress={() => setOption(!option)}>
                <FontAwesomeIcon icon={faCircle} color='#225372d9' size={20} />
              </Pressable>
            )}

            <Text className='flex-1'>
              <Text className='font-medium text-red-400'>Tomorrow by 6pm</Text>{' '}
              - FREE delivery with your JU membership
            </Text>
          </View>

          <Pressable
            onPress={() => {
              option === true ? setCurrentStep(2) : null;
            }}
            className='p-2.5 rounded-3xl items-center justify-center bg-[#225372d9]'
          >
            <Text className='text-white text-base tracking-wide font-medium'>
              Continue
            </Text>
          </Pressable>
        </View>
      )}

      {currentStep === 2 && (
        <View className='mx-5'>
          <Text className='text-xl font-bold tracking-tight'>
            Select your payment Method
          </Text>

          <View className='bg-white p-2 border-gray-50 border flex-row items-center gap-2 mt-3'>
            {selectedOption === 'cash' ? (
              <Pressable>
                <FontAwesomeIcon
                  icon={faCircleDot}
                  color='#225372d9'
                  size={20}
                />
              </Pressable>
            ) : (
              <Pressable onPress={() => setSelectedOption('cash')}>
                <FontAwesomeIcon icon={faCircle} color='#225372d9' size={20} />
              </Pressable>
            )}

            <Text className='font-normal tracking-wide'>Cash on Delivery</Text>
          </View>

          <View className='bg-white p-2 border-gray-50 border flex-row items-center gap-2 mt-3'>
            {selectedOption === 'card' ? (
              <Pressable>
                <FontAwesomeIcon
                  icon={faCircleDot}
                  color='#225372d9'
                  size={20}
                />
              </Pressable>
            ) : (
              <Pressable
                onPress={() => {
                  setSelectedOption('card');

                  setShowPopUp(true);
                }}
              >
                <FontAwesomeIcon icon={faCircle} color='#225372d9' size={20} />
              </Pressable>
            )}

            <Text className='font-normal tracking-wide'>
              Pay with International debit/credit card
            </Text>
          </View>

          <Pressable
            onPress={() => setCurrentStep(3)}
            className='p-2.5 rounded-3xl mt-3 items-center justify-center bg-[#225372d9]'
          >
            <Text className='text-white text-base tracking-wide font-medium'>
              Continue
            </Text>
          </Pressable>
        </View>
      )}

      {currentStep === 3 && selectedOption === 'cash' && (
        <View className='mx-5'>
          <Text className='text-xl font-bold'>Order Now</Text>

          <View className='flex-row items-center justify-between gap-2 bg-white p-1 border border-gray-200 mt-1.5'>
            <View className='mt-0'>
              <Text className='text-lg font-bold'>
                Save 5% and never run out
              </Text>
              <Text className='text-base text-gray-500 mt-1'>
                Fast delivery assured
              </Text>
            </View>

            <ChevronRightIcon size={24} color='black' />
          </View>

          <View className='bg-white p-2 border-gray-200 -ml-1.5 border mt-2.5'>
            <Text className='text base tracking-wide'>
              Shipping to {selectedAddress?.name}
            </Text>

            <View className='flex-row items-center justify-between mt-2'>
              <Text className='text-base font-medium text-gray-500'>Items</Text>

              <Text className='text-gray-500 text-base'>₦{formattedTotal}</Text>
            </View>

            <View className='flex-row items-center justify-between mt-2'>
              <Text className='text-base font-medium text-gray-500'>
                Delivery
              </Text>

              <Text className='text-gray-500 text-base'>₦0</Text>
            </View>

            <View className='flex-row items-center justify-between mt-2'>
              <Text className='text-lg font-bold'>Order Total</Text>

              <Text className='text-red-700 text-lg font-bold'>
                ₦{formattedTotal}
              </Text>
            </View>
          </View>

          <View className='bg-white p-2 border mt-2.5 -ml-1.5 border-gray-200'>
            <Text className='text-gray-500 text-base'>Pay With</Text>

            <Text className='font-semibold text-base mt-1.5'>
              Pay on delivery (Cash)
            </Text>
          </View>

          <Pressable
            onPress={handlePlaceOrder}
            className='p-2.5 rounded-3xl mt-5 items-center justify-center bg-[#225372d9]'
          >
            <Text className='text-white text-base tracking-wide font-medium'>
              Place your order
            </Text>
          </Pressable>
        </View>
      )}

      <View className='flex-1'>
        <Dialog.Container
          visible={showPopUp}
          onBackdropPress={() => setShowPopUp(false)}
        >
          <Dialog.Title className='text-lg mt-0 tracking-wide'>
            Pay Online
          </Dialog.Title>
          <Dialog.Description className='text-base tracking-tight'>
            Pay with your debit/credit card using Flutterwave
          </Dialog.Description>
          <Dialog.Button
            label='Cancel'
            onPress={() => {
              setShowPopUp(false);
              setSelectedOption('');
            }}
          />
          <Dialog.Button
            bold={true}
            color='green'
            label='Ok'
            onPress={() => {
              setCurrentStep(0);
              setSelectedOption('');
              setShowPopUp(false);
              navigation.navigate('FlutterPay');
            }}
          />
        </Dialog.Container>
      </View>
    </ScrollView>
  );
};

export default ConfirmationScreen;
