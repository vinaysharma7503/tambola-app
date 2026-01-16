/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Splash from './Src/Screens/Splash/Splash';
import Login from './Src/Screens/Login/Login';
import { Fragment, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootStack from './Src/Navigations/RootStack';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [isSplashFinished, setSplashFinished] = useState(false);

  return (
    <Fragment>
      {!isSplashFinished ?<Splash onFinish={() => setSplashFinished(true)} />
    :<SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <RootStack/>
      </NavigationContainer>
    </SafeAreaProvider>}
    </Fragment>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <NewAppScreen
        templateFileName="App.tsx"
        safeAreaInsets={safeAreaInsets}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
