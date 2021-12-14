import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavScreen from './TabNavScreen';
import AddReminder from '../AddReminder';

const RootStack = createStackNavigator();
const RootStackScreen = () => {
    return (
        <RootStack.Navigator screenOptions={{
            headerShown: false,
            animationEnabled: false,
        }}>
            <RootStack.Screen
                name="AddReminder"
                component={ AddReminder }
                options={{ 
                    animationEnabled: true,
                    headerShown: true,
                    headerTitle: "Add a reminder",
                }}
            />
            <RootStack.Screen 
                name="TabNavScreen"
                component={ TabNavScreen }
            />
            
            
        </RootStack.Navigator>
    );
}

export default RootStackScreen;