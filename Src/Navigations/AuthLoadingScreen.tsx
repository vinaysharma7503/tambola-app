import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const AuthLoadingScreen = () => {
  const navigation = useNavigation<any>();
  const { userInfo } = useSelector((state: any) => state?.LoginReducer);
  const { data, isAuth } = userInfo || {};

  useEffect(() => {
    checkToken();
  }, [isAuth]);

  const checkToken = async () => {
    try {
      if (data?.token) {
        await AsyncStorage.setItem('token', data?.token);

        navigation.reset({
          index: 0,
          routes: [{ name: 'App' }],
        });

      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Auth' }],
        });
      }
    } catch (error) {
      console.error('Error checking token:', error);
    }
  };

  return (
    <View style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    }}>
      <ActivityIndicator size="large" color="#008B62" />
    </View>
  );
};

export default AuthLoadingScreen;
