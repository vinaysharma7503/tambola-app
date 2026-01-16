import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthLoadingScreen from './AuthLoadingScreen';
import AuthStackNavigator from './AuthStackNavigator';
import MainStackNavigator from './MainStackNavigator';

const Root = createNativeStackNavigator();

const RootStack = () => {
  return (
    <Root.Navigator screenOptions={{ headerShown: false }}>
      {/* <Root.Screen name="AuthLoading" component={AuthLoadingScreen} /> */}
      <Root.Screen name="Auth" component={AuthStackNavigator} />
      <Root.Screen name="App" component={MainStackNavigator} />
    </Root.Navigator>
  );
};

export default RootStack;
