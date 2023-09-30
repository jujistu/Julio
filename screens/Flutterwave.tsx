import { View } from 'react-native';
import React, { FC } from 'react';

import { useUserContext } from '../context/UserContext';
import { useAppDispatch, useAppSelector } from '../redux/Hooks';
import { PayWithFlutterwave } from 'flutterwave-react-native';
import { useToast } from 'react-native-toast-notifications';
import axios from 'axios';
import { clearCart } from '../redux/CartReducer';
import { formattedPrice } from '../hooks/Helpers';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Prop = NativeStackScreenProps<RootStackParamList, 'FlutterPay'>;

interface RedirectParams {
  status: 'successful' | 'cancelled';
  transaction_id?: string;
  tx_ref: string;
}

const Flutterwave: FC<Prop> = ({ navigation }) => {
  const toast = useToast();

  const { selectedAddress, userId, user } = useUserContext();
  // ////
  const cart = useAppSelector((state) => state.cart.cart);

  const flutterWave_Key = process.env.flutterWave_Key as string;

  const dispatch = useAppDispatch();

  const total = cart
    ?.map((item) => item.quantity * item.price)
    .reduce((cur, prev) => cur + prev, 0);

  const formattedTotal = formattedPrice(total);
  ///

  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        userId,
        cartItems: cart,
        totalPrice: formattedTotal,
        shippingAddress: selectedAddress,
        paymentMethod: 'card',
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

  const handleOnRedirect = async (data: RedirectParams) => {
    if (data.status === 'successful') {
      await handlePlaceOrder();
    }

    if (data.status === 'cancelled') {
      navigation.goBack();
    }
  };

  const generateTransactionRef = (length: number) => {
    let result = '';
    let characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return `flw_tx_ref_${result}`;
  };

  return (
    <View className='flex-1 justify-center items-center bg-white'>
      <PayWithFlutterwave
        onRedirect={handleOnRedirect}
        options={{
          tx_ref: generateTransactionRef(10),
          authorization: 'FLWPUBK_TEST-81e0b9e6dd0461c49a5e51a361f48179-X',
          customer: {
            email: `${user?.email}`,
            name: `${user?.name}`,
            phonenumber: selectedAddress.mobileNo,
          },
          amount: Math.round(total * 970),
          currency: 'NGN',
          payment_options: 'card',
        }}
      />
    </View>
  );
};

export default Flutterwave;
