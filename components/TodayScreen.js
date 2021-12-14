import React from 'react';
import {Text, Button, ScrollView } from "react-native";
import Goal from './Goal';
import FloatingButton from './FloatingButton';

const TodayScreen = ({ navigation }) => {
    return (
        <>
            <ScrollView>
                <Goal />
                <Goal />
                <Goal />
            </ScrollView>
            <FloatingButton text="+" navigation={navigation} navigateTo="AddGoal" />
        </>
    );
}

export default TodayScreen;