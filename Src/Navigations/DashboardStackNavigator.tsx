import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Dashboard } from '../Screens/Dashboard/Dashboard';
import CreateGame from '../Screens/CreateGame/CreateGame';
import JoinGame from '../Screens/JoinGame/JoinGame';
import Profile from '../Screens/Profile/Profile';
import LiveGame from '../Screens/LiveGame/LiveGame';
import Colors from '../Constants/Colors';

const DashboardStack = createNativeStackNavigator();

const DashboardStackNavigator = () => {
    return (
        <DashboardStack.Navigator
            initialRouteName="DashboardHome"
            screenOptions={{
                headerShown: false,
                headerTintColor: Colors.white,
                headerStyle: { backgroundColor: Colors.primary },
            }}>
            <DashboardStack.Screen
                name="DashboardHome"
                component={Dashboard}
            />
            <DashboardStack.Screen
                name="CreateGame"
                component={CreateGame}
            />
            <DashboardStack.Screen
                name="JoinGame"
                component={JoinGame}
            />
            <DashboardStack.Screen
                name="Profile"
                component={Profile}
            />
            <DashboardStack.Screen
                name="LiveGame"
                component={LiveGame}
            />
        </DashboardStack.Navigator>
    );
};

export default DashboardStackNavigator;
