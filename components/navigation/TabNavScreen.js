import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import TodayScreen from '../screens/TodayScreen';
import LongtermScreen from '../screens/LongtermScreen';
import RemindersScreen from '../screens/RemindersScreen';
import MonthScreen from '../screens/MonthScreen';
import { tabNavScreenStyles, colors, flexStyles } from '../common/styles';

const Tab = createMaterialTopTabNavigator();
const TabNavScreen = ({navigation}) => {
    const [date, setDate] = useState(null);

    useEffect(() => {
        // set current date to bar on top
        const today = new Date;
        setDate(today.getDate() + ". " + (today.getMonth() + 1) + ". " + today.getFullYear());
    }, []);

    return (
        <View style={ tabNavScreenStyles.container }>
            <View style={[tabNavScreenStyles.dateContainer, flexStyles.alignedRow]}>
                <Text style={tabNavScreenStyles.dateText} onPress={() => {
                    navigation.navigate("SettingsScreen");
                }}>🛠</Text>
                <Text style={tabNavScreenStyles.dateText}>{date}</Text>
            </View>
            <Tab.Navigator 
                initialRouteName={"Today"}
                screenOptions={{
                    tabBarItemStyle: {
                        backgroundColor: colors.colorPopBlue
                    },
                    tabBarLabelStyle: { fontSize: 11 },
                    tabBarStyle: { backgroundColor: 'dodgerblue' },
                    tabBarInactiveTintColor: "black",
                    tabBarPressColor: "rgba(255, 255, 255, 0.3)",
                    tabBarActiveTintColor: colors.colorPopDarkBlue,
                    tabBarInactiveTintColor: colors.colorText,
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