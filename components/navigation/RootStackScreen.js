import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavScreen from './TabNavScreen';
import Reminders from '../Reminders';

const RootStack = createStackNavigator();
const RootStackScreen = () => {
    return (
        <RootStack.Navigator screenOptions={{
            headerShown: false,
            animationEnabled: false,
        }}>
            <RootStack.Screen 
                name="TabNavScreen"
                component={ TabNavScreen }
            />
            <RootStack.Screen
                name="Modal"
                component={ Reminders }
                options={{ 
                    animationEnabled: true,
                    headerShown: true,
                }}
            />
        </RootStack.Navigator>
    );
}

export default RootStackScreen;