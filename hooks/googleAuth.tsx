import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, Button } from 'react-native';
import React, { useEffect } from 'react';

WebBrowser.maybeCompleteAuthSession();

//npx expo run:ios

const [request, response, promptAsync] = Google.useAuthRequest({
  webClientId:
    '14199241157-3j4oop5l0oirqdohunuke1i2b7v5lal6.apps.googleusercontent.com',
  iosClientId:
    '14199241157-ou7s4rt7gmcurvi3fd8ls69d6g259tp8.apps.googleusercontent.com',
});

const handleSignInWithGoogle = async () => {
  const user = await AsyncStorage.getItem('@user');

  if (!user) {
    if (response?.type === 'success') {
      await getUserInfo(response.authentication?.accessToken);
    }
  } else {
    // setUserInfo(JSON.parse(user)); state
  }
};
const getUserInfo = async (token: unknown) => {
  if (!token) return;
  try {
    const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const user = await response.json();
    await AsyncStorage.setItem('@user', JSON.stringify(user));
    // setUserInfo(user); state
  } catch (error) {
    console.log(error);
  }
};

//userInfo consist of id,email,verified_email=boolean,name
const googleAuth = () => {
  useEffect(() => {
    handleSignInWithGoogle();
  }, [response]);
  return (
    <View>
      <Text>googleAuth</Text>
      <Button title='sign in' onPress={() => promptAsync()} />
    </View>
  );
};

export default googleAuth;
