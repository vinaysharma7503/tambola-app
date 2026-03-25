import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardStackNavigator from './DashboardStackNavigator';
import Colors from '../Constants/Colors';


const MainStack = createNativeStackNavigator();

  const commonScreenOptions = {
    headerShown: false,
    headerTintColor: Colors.white,
    headerStyle: { backgroundColor: Colors.primary },
  };

const MainStackNavigator = () => {
  return (
    <MainStack.Navigator>
      <MainStack.Screen  key="Dashboard"
        name="Dashboard"
        component={DashboardStackNavigator}
        options={commonScreenOptions}/>
    </MainStack.Navigator>
  )
}

export default MainStackNavigator