import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import TodayScreen from '../Today';
import Longterm from '../Longterm';
import Reminders from '../Reminders';

const Tab = createMaterialTopTabNavigator();
const TabNavScreen = () => {
    const [date, setDate] = useState(null);

    useEffect(() => {
        // set current date to bar on top
        const today = new Date;
        setDate(today.getDate() + ". " + (today.getMonth() + 1) + ". " + today.getFullYear());
    }, []);

    return (
        <View style={ styles.container }>
            <Text style={ styles.dateText }>{date}</Text>
            <Tab.Navigator 
                initialRouteName={"Reminders"}
                screenOptions={{
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
                <Tab.Screen name="Month" component={ TodayScreen } />
                <Tab.Screen name="Longterm" component={ Longterm } />
                <Tab.Screen name="Reminders" component={ Reminders } />
            </Tab.Navigator>
        </View>
    );
}


const styles = StyleSheet.create({
    dateText: {
        backgroundColor: "lime",
        textAlign: "right",
        padding: 10,
        fontWeight: "bold",
    },
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
    },
});

export default TabNavScreen;