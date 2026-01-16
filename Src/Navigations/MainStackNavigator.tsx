import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Dashboard from '../Screens/Dashboard/Dashboard';


const MainStack = createNativeStackNavigator();

const MainStackNavigator = () => {
  return (
    <MainStack.Navigator>
      <MainStack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }}/>
    </MainStack.Navigator>
  )
}

export default MainStackNavigator