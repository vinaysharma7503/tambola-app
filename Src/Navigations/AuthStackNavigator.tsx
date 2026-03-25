import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from '../Screens/Login/Login';
import Onboarding from '../Screens/Onboarding/Onboarding';
import DashboardStackNavigator from './DashboardStackNavigator';
import Colors from '../Constants/Colors';
import Verify from '../Screens/Verify/Verify';

const AuthStack = createNativeStackNavigator();

const AuthStackNavigator = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const value = await AsyncStorage.getItem('alreadyLaunched');
        if (value === null || value === 'false') {
          await AsyncStorage.setItem('alreadyLaunched', 'true');
          setIsFirstLaunch(true);
        } else {
          setIsFirstLaunch(false);
        }
      } catch (error) {
        console.error('Error checking first launch:', error);
      }
    };

    checkFirstLaunch();
  }, []);

  if (isFirstLaunch === null) {
    return null;
  }

  const commonScreenOptions = {
    headerShown: false,
    headerTintColor: Colors.white,
    headerStyle: { backgroundColor: Colors.primary },
  };

  const screens = isFirstLaunch
    ? [
      <AuthStack.Screen
        key="Onboarding"
        name="Onboarding"
        options={commonScreenOptions}
      >
        {props => (
          <Onboarding
            {...props}
            onComplete={() => {
              // Navigate to Login after onboarding is complete
              props.navigation.replace('Login');
            }}
          />
        )}
      </AuthStack.Screen>,
      <AuthStack.Screen
        key="Login"
        name="Login"
        component={Login}
        options={commonScreenOptions}
      />,
      <AuthStack.Screen
        key="Verify"
        name="Verify"
        component={Verify}
        options={commonScreenOptions}
      />,
    ]
    : [
      <AuthStack.Screen
        key="Login"
        name="Login"
        component={Login}
        options={commonScreenOptions}
      />,
      <AuthStack.Screen
       key="Verify"
        name="Verify"
        component={Verify}
        options={commonScreenOptions}
      />,
    ];

  return (
    <AuthStack.Navigator
      initialRouteName={isFirstLaunch ? 'Onboarding' : 'Login'}>
      {screens}
    </AuthStack.Navigator>
  );
};

export default AuthStackNavigator;