import React from 'react';
import { View, Text, Button } from "react-native";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("db.db");

const TodayScreen = () => {
    return (
        <View>
            <Text>Nibi!</Text>
            <Button title="Hello" onPress={() => {
                db.transaction((tx) => {
                        tx.executeSql("SELECT * FROM goals", [], (_, { rows }) =>
                        console.log(JSON.stringify(rows))
                    );
                });
            }} />
        </View>
    );
}

export default TodayScreen;