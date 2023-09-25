import { ProductInfo } from '../components/types';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Main: undefined;
  ProductInfo: ProductInfo;
  AddAddress: undefined;
};

export type TabStackParamList = {
  Home: undefined;
  Profile: undefined;
  Cart: undefined;
};
