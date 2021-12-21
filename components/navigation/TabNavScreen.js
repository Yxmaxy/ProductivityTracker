import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import TodayScreen from '../screens/TodayScreen';
import LongtermScreen from '../screens/LongtermScreen';
import RemindersScreen from '../screens/RemindersScreen';
import MonthScreen from '../screens/MonthScreen';
import { tabNavScreenStyles } from '../common/styles';

const Tab = createMaterialTopTabNavigator();
const TabNavScreen = () => {
    const [date, setDate] = useState(null);

    useEffect(() => {
        // set current date to bar on top
        const today = new Date;
        setDate(today.getDate() + ". " + (today.getMonth() + 1) + ". " + today.getFullYear());
    }, []);

    return (
        <View style={ tabNavScreenStyles.container }>
            <Text style={ tabNavScreenStyles.dateText }>{date}</Text>
            <Tab.Navigator 
                initialRouteName={"Today"}
                screenOptions={{
                    tabBarItemStyle: {
                        backgroundColor: "red"
                    },
                    tabBarLabelStyle: { fontSize: 11 },
                    tabBarStyle: { backgroundColor: 'dodgerblue' },
                    tabBarInactiveTintColor: "black",
                    tabBarPressColor: "rgba(255, 255, 255, 0.3)",
                    tabBarActiveTintColor: "yellow",
                    tabBarIndicatorStyle: {
                        backgroundColor: "yellow"
                    },
                }}
            >
                <Tab.Screen name="Today" component={ TodayScreen } />
                <Tab.Screen name="Month" component={ MonthScreen } />
                <Tab.Screen name="Longterm" component={ LongtermScreen } />
                <Tab.Screen name="Reminders" component={ RemindersScreen } />
            </Tab.Navigator>
        </View>
    );
}

export default TabNavScreen;