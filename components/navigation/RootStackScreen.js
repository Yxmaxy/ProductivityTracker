import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavScreen from './TabNavScreen';
import AddReminder from '../screens/modals/AddReminder';
import AddGoal from '../screens/modals/AddGoal';
import AddGroup from '../screens/modals/AddGroup';

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
                name="AddReminder"
                component={ AddReminder }
                options={{ 
                    animationEnabled: true,
                    headerShown: true,
                    headerTitle: "Add a reminder",
                }}
            />
            <RootStack.Screen
                name="AddGoal"
                component={ AddGoal }
                options={{ 
                    animationEnabled: true,
                    headerShown: true,
                    headerTitle: "Add a goal",
                }}
            />
            <RootStack.Screen
                name="AddGroup"
                component={ AddGroup }
                options={{ 
                    animationEnabled: true,
                    headerShown: true,
                    headerTitle: "Add a group",
                }}
            />
        </RootStack.Navigator>
    );
}

export default RootStackScreen;