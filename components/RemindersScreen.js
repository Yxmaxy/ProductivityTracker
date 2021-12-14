import React, { useEffect, useState } from "react";
import * as SQLite from "expo-sqlite";
import { StyleSheet, ScrollView, Text } from "react-native";
import FloatingButton from "./FloatingButton";
import Goal from "./Goal";

const db = SQLite.openDatabase("db.db");

const RemindersScreen = ({ navigation }) => {
    const [reminders, setReminders] = useState([1, 2, 3]);

    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql("SELECT * FROM Reminders;", [], (_, { rows }) => {
                setReminders(rows._array);
            }, (t, error) => {
                console.log(error);
            });
        });
    }, []);

    return(
        <>
            <ScrollView style={ styles.container }>
                {reminders.map(reminder => {
                    console.log(reminder);
                    return (<Goal id={reminder.id_reminder} title={reminder.name} />);
                })}
            </ScrollView>
            <FloatingButton text="+" navigation={navigation} navigateTo="AddReminder" />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
export default RemindersScreen;