import React from 'react';
import {Text, Button, ScrollView } from "react-native";
import Goal from './Goal';

const TodayScreen = () => {
    return (
        <ScrollView>
            <Goal />
            <Goal />
            <Goal />
        </ScrollView>
    );
}

export default TodayScreen;