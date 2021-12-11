import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Constants from "expo-constants";
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

function HomeScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Home!</Text>
        </View>
    );
}
  
  function SettingsScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Settings!</Text>
        </View>
    );
}

const Tab = createMaterialTopTabNavigator();

export default function App() {
    const [date, setDate] = useState(null);

    useEffect(() => {
        const today = new Date;
        setDate(today.getDate() + ". " + (today.getMonth() + 1) + ". " + today.getFullYear());
    }, [])

    return (
        <View style={ styles.container }>
            <Text style={styles.dateText}>{date}</Text>
            <NavigationContainer>
                <Tab.Navigator 
                    initialRouteName={"Today"}
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
                    <Tab.Screen name="Today" component={HomeScreen} />
                    <Tab.Screen name="Month" component={SettingsScreen} />
                    <Tab.Screen name="Longterm" component={SettingsScreen} />
                    <Tab.Screen name="Reminders" component={SettingsScreen} />
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
