import React, { useEffect, useState } from "react";
import * as SQLite from "expo-sqlite";
import { StyleSheet, ScrollView, Text } from "react-native";
import FloatingButton from "./FloatingButton";

const db = SQLite.openDatabase("db.db");

const Reminders = () => {
    const [reminders, setReminders] = useState([1, 2, 3]);

    useEffect(() => {
        /*db.transaction((tx) => {
            tx.executeSql("SELECT * FROM Reminders;", [], (_, { rows }) => {
                setReminders(rows._array);
            }, (t, error) => {
                console.log(error);
            })
        });*/
    }, []);

    return(
        <>
            <ScrollView style={ styles.container }>
                {reminders.map(reminder => {
                    //console.log(reminder);
                    return (<Text id={reminder}>{reminder}</Text>);
                })}
            </ScrollView>
            <FloatingButton text="Hello" />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
export default Reminders;