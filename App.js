import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Constants from "expo-constants";
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import * as SQLite from "expo-sqlite";
import TodayScreen from './components/Today';
import Longterm from './components/Longterm';
import Reminders from './components/Reminders';

//* Database
const db = SQLite.openDatabase("db.db");

//* Navigator
const Tab = createMaterialTopTabNavigator();

//* App component
const App = () => {
    const [date, setDate] = useState(null);

    useEffect(() => {
        // set current date to bar on top
        const today = new Date;
        setDate(today.getDate() + ". " + (today.getMonth() + 1) + ". " + today.getFullYear());

        // create tables if they don't exist
        db.transaction((tx) => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS Goals (
                    id_goal INTEGER PRIMARY KEY AUTOINCREMENT,
                    name VARCHAR(100),
                    id_group INTEGER,
                    activity_length INTEGER,
                    is_longterm BOOLEAN,
                    FOREIGN KEY(id_group) REFERENCES GoalGroups(id_group)
                );`
            );
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS Reminders (
                    id_reminder INTEGER PRIMARY KEY AUTOINCREMENT,
                    name VARCHAR(100),
                    notify_when DATETIME
                );`
            );
        });
    }, [])

    return (
        <View style={ styles.container }>
            <Text style={styles.dateText}>{date}</Text>
            <NavigationContainer>
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
            </NavigationContainer>
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

export default App;