import { ProductInfo } from '../components/types';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Main: undefined;
  ProductInfo: ProductInfo;
  Address: undefined;
  AddAddress: undefined;
  Confirmation: undefined;
  OrderScreen: undefined;
  FlutterPay: undefined;
};

export type TabStackParamList = {
  Home: undefined;
  Profile: undefined;
  Cart: undefined;
};
