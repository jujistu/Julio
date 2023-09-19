import {
  View,
  Text,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, { FC, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  EnvelopeOpenIcon,
  LockClosedIcon,
  UserIcon,
  ChevronRightIcon,
  EyeIcon,
  EyeSlashIcon,
} from 'react-native-heroicons/solid';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useToast } from 'react-native-toast-notifications';
import axios from 'axios';

type Prop = NativeStackScreenProps<RootStackParamList, 'Register'>;

const RegisterScreen: FC<Prop> = ({ navigation }) => {
  const toast = useToast();

  const [name, setName] = useState<string>('');
  const [password, setPassWord] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const [noShowPassword, setNoShowPassword] = useState<boolean>(true);

  const isFormValid = () => {
    if (password !== confirmPassword) {
      toast.show('Password do not match', {
        type: 'warning',
        animationType: 'zoom-in',
        duration: 4000,
      });
    } else if (
      name &&
      name.trim() === '' &&
      email &&
      email.trim() === '' &&
      password &&
      password.trim() === ''
    ) {
      toast.show('Input all fields', {
        type: 'danger',
        animationType: 'zoom-in',
        duration: 4000,
      });
    }
  };

  isFormValid();

  const handleShowPassword = () => {
    setNoShowPassword(!noShowPassword);
  };

  //handle register
  const handleRegister = () => {
    setLoading(true);
    const user = {
      name,
      email,
      password,
    };

    //send post request to backend Api
    axios
      .post('http://localhost:8000/register', user)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          toast.show('Registration Successful', {
            type: 'success',
            animationType: 'slide-in',
            duration: 4000,
          });
          setLoading(false);
          setEmail('');
          setName('');
          setConfirmPassword('');
          setPassWord('');
          navigation.replace('Login');
        }
      })
      .catch((error) => {
        toast.show('Registration Error', {
          type: 'danger',
          animationType: 'zoom-in',
          duration: 4000,
        });
        console.log('registration failed', error);
      });
  };

  return loading ? (
    <ActivityIndicator size='large' color='#213555' />
  ) : (
    <SafeAreaView className='flex-1 bg-white items-center relative'>
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
            Register your account
          </Text>
        </View>
        {/* form */}
        <View className='mt-3'>
          <View className='flex-row items-center gap-x-3 py-2 rounded-sm '>
            <UserIcon size={25} color='black' />
            <TextInput
              onChangeText={(text) => setName(text)}
              value={name}
              textAlign='left'
              autoComplete='name'
              className='w-80 placeholder:px-3 placeholder:py-4 text-base bg-gray-300'
              placeholder='John Doe'
            />
          </View>
        </View>
        <View className='mt-5'>
          <View className='flex-row items-center gap-x-3 py-2 rounded-sm '>
            <EnvelopeOpenIcon size={25} color='black' />
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
              placeholder='password'
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
        <View className='mt-5'>
          <View className='flex-row items-center gap-3 py-2 rounded-sm '>
            <LockClosedIcon size={25} color='black' />
            <TextInput
              onChangeText={(text) => setConfirmPassword(text)}
              value={confirmPassword}
              autoComplete='password'
              textAlign='left'
              secureTextEntry={noShowPassword}
              className='w-80 placeholder:px-3 placeholder:py-4 bg-gray-300 text-base'
              placeholder='confirm password'
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

        <View className='mt-10' />

        {/* login button  */}
        <TouchableOpacity
          onPress={handleRegister}
          activeOpacity={0.8}
          className='mx-auto p-3 rounded-md w-56 shadow-lg flex-row items-center justify-center  bg-blue-950 '
        >
          <Text className='text-center font-bold text-white text-lg mr-3 tracking-wider'>
            Register
          </Text>
          <ChevronRightIcon className='' size={20} color='white' />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          className='mt-2'
          onPress={() => navigation.navigate('Login')}
        >
          <Text className='text-center tracking-tighter'>
            Already have an account? Sign In
          </Text>
        </TouchableOpacity>

        <View className='mt-5' />
        <View>
          <Text className='mx-auto text-center text-xl shadow-sm font-semibold'>
            Or
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          className='mx-auto px-7 py-4 mt-7 rounded-md w-56 shadow-lg flex-row items-center justify-between  bg-blue-950 '
        >
          <Text className='text-center font-bold text-white text-sm tracking-tight'>
            Sign Up with Google
          </Text>

          <FontAwesomeIcon icon={faGoogle} size={20} color='white' />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
