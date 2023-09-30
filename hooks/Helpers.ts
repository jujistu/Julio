import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

//format price
export const formattedPrice = (price: number) => {
  const initialPrice = price * 970;

  const formattedPrice = initialPrice.toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });

  return formattedPrice;
};

//fetch addresses
export const fetchAddresses = async (setAddresses: any, userId: any) => {
  try {
    const response = await axios.get(
      `http://localhost:8000/addresses/${userId}`
    );

    const { addresses } = response.data;

    setAddresses(addresses);
  } catch (error) {
    console.log('errorAddress', error);
  }
};

//fetch User
export const fetchUser = async (setUserId: any) => {
  const token = await AsyncStorage.getItem('authToken');

  if (token) {
    const decodedToken: any = jwtDecode(token);

    const userId = decodedToken.userId;

    setUserId(userId);
  }
};

//add hours to date
export const addHours = (date: Date, hours: number) => {
  date.setTime(date.getTime() + hours * 60 * 60 * 1000);

  return date;
};

//fetch UserProfile
export const fetchUserProfile = async (setUser: any, userId: string) => {
  try {
    const response = await axios.get(`http://localhost:8000/profile/${userId}`);
    const { user } = response.data;
    setUser(user);
  } catch (error) {
    console.log('error', error);
  }
};

export const fetchOrders = async (
  userId: string,
  setOrders: any,
  setLoading: any
) => {
  try {
    // setLoading(true);
    const response = await axios.get(`http://localhost:8000/orders/${userId}`);
    const orders = response.data.orders;
    setOrders(orders);

    setLoading(false);
  } catch (error) {
    console.log('error', error);
  }
};
