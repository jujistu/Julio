import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { FC, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  ArrowLongRightIcon,
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
} from 'react-native-heroicons/solid';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useToast } from 'react-native-toast-notifications';

type Prop = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: FC<Prop> = ({ navigation }) => {
  const toast = useToast();

  const [email, setEmail] = useState<string>();
  const [password, setPassWord] = useState<string>();
  const [noShowPassword, setNoShowPassword] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const handleShowPassword = () => {
    setNoShowPassword(!noShowPassword);
  };

  //check if loggedIn
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');

        if (token) {
          navigation.replace('Main');
        }
      } catch (error) {
        console.log('error login', error);
      }
    };
    checkLoginStatus();
  }, []);

  const handleLogin = () => {
    setLoading(true);
    const user = { email: email?.toLowerCase(), password: password };

    axios
      .post('http://localhost:8000/login', user)
      .then((response) => {
        console.log(response);

        const token = response.data.token;

        if (token) {
          toast.show('Login Successful', {
            type: 'success',
            animationType: 'zoom-in',
            duration: 5000,
          });

          AsyncStorage.setItem('authToken', token);

          navigation.navigate('Main');
          setLoading(false);
        }
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          toast.show('Invalid email or password', {
            type: 'danger',
            animationType: 'slide-in',
            duration: 5000,
          });

          setEmail('');
          setPassWord('');
          setLoading(false);
        }

        if (error.response?.status === 402) {
          toast.show('Invalid password', {
            type: 'danger',
            animationType: 'slide-in',
            duration: 5000,
          });

          setPassWord('');
          setLoading(false);
        }

        if (error.response?.status === 403) {
          toast.show('Verify your email', {
            type: 'warning',
            animationType: 'zoom-in',
            duration: 5000,
          });
          setLoading(false);
        }

        toast.show('Login failed', {
          type: 'danger',
          animationType: 'zoom-in',
          duration: 5000,
        });
        console.log(`error ${error.response?.status} login`);
        setLoading(false);
      });
  };

  return loading ? (
    <ActivityIndicator
      size='large'
      color='#213555'
      className='flex-1 justify-center items-center'
    />
  ) : (
    <SafeAreaView className='flex-1 bg-white items-center'>
      <StatusBar style='dark' />
      <View>
        <Image
          source={{
            uri: 'https://i.ibb.co/D4LWwCP/julio-logo-removebg-preview.png',
          }}
          className='w-48 h-36'
        />
      </View>

      <KeyboardAvoidingView>
        <View className='items-center'>
          <Text className='text-lg font-bold mt-4 text-gray-900 tracking-wide'>
            Login to your account
          </Text>
        </View>
        {/* form */}
        <View className=''>
          <View className='flex-row items-center gap-x-3 py-2 rounded-sm mt-10 '>
            <EnvelopeIcon size={25} color='black' />
            <TextInput
              onChangeText={(text) => setEmail(text)}
              value={email}
              textAlign='left'
              autoComplete='email'
              className='w-80 placeholder:px-3 placeholder:py-4 text-base bg-gray-300'
              placeholder='user@email.com'
            />
          </View>
        </View>
        <View className='mt-5'>
          <View className='flex-row items-center gap-3 py-2 rounded-sm '>
            <LockClosedIcon size={25} color='black' />
            <TextInput
              onChangeText={(text) => setPassWord(text)}
              value={password}
              autoComplete='password'
              textAlign='left'
              secureTextEntry={noShowPassword}
              className='w-80 placeholder:px-3 placeholder:py-4 bg-gray-300 text-base'
              placeholder='*********'
            />
            {noShowPassword ? (
              <TouchableOpacity
                onPress={handleShowPassword}
                className='absolute left-80 top-6'
              >
                <EyeSlashIcon color='black' />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleShowPassword}
                className='absolute left-80 top-6'
              >
                <EyeIcon color='black' />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View className='justify-between items-center flex-row mt-2'>
          <Text className='tracking-tighter'>Keep me logged in</Text>
          <TouchableOpacity>
            <Text className='text-blue-500 font-medium'>forgot password</Text>
          </TouchableOpacity>
        </View>

        <View className='mt-16' />

        {/* login button  */}
        <TouchableOpacity
          onPress={handleLogin}
          activeOpacity={0.8}
          className='mx-auto p-3 rounded-md w-56 shadow-lg flex-row items-center justify-center  bg-blue-950 '
        >
          <Text className='text-center font-bold text-white text-lg mr-3 tracking-wider'>
            Login
          </Text>
          <ArrowLongRightIcon className='' size={20} color='white' />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          className='mt-2'
          onPress={() => navigation.navigate('Register')}
        >
          <Text className='text-center tracking-tighter'>
            Don't have an account? Sign Up
          </Text>
        </TouchableOpacity>

        <View className='mt-10' />
        <View>
          <Text className='mx-auto text-center text-xl shadow-sm font-semibold'>
            Or
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          className='mx-auto px-5 py-3 mt-7 rounded-md w-56 shadow-lg flex-row items-center justify-around  bg-blue-950 '
        >
          <Text className='text-center font-bold text-white gap-x-2 text-lg tracking-tight'>
            Sign In with Google
          </Text>
          <FontAwesomeIcon icon={faGoogle} size={20} color='white' />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
