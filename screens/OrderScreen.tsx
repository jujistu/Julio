import { View, Text, SafeAreaView } from 'react-native';
import React, { FC, useEffect } from 'react';
import LottieView from 'lottie-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Prop = NativeStackScreenProps<RootStackParamList, 'OrderScreen'>;

const OrderScreen: FC<Prop> = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Main');
    }, 7000);
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
      <LottieView
        source={require('../assets/julio.json')}
        style={{
          height: 260,
          width: '100%',
          alignSelf: 'center',
          justifyContent: 'center',
        }}
        autoPlay
        loop={false}
        speed={0.9}
      />
      <Text
        style={{
          marginTop: 150,
          fontSize: 26,
          fontWeight: 'bold',
          textAlign: 'center',
          textShadowColor: '#2d87bb',
          textShadowOffset: { width: 2, height: 2 },
          textShadowRadius: 3,
        }}
      >
        Your Order Has been Received
      </Text>
    </SafeAreaView>
  );
};

export default OrderScreen;
