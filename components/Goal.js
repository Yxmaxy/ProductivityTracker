import React, { useEffect, useState } from "react";
import {StyleSheet, TouchableOpacity, Text } from "react-native";
import Checkbox from "expo-checkbox";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("db.db");

const Goal = ({ id, title, color }) => {
    const [isDone, setIsDone] = useState(false);

    // set initial value
    useEffect(() => {
        db.transaction(tx => {
            const currentDate = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate();
            tx.executeSql(`
                SELECT * 
                FROM GoalFinished
                WHERE id_goal = ? AND date_finished = ?;
            `, [id, currentDate], (_, { rows }) => {
                setIsDone(rows._array.length > 0);
            }, (t, error) => {
                console.log(error);
            });
        });
    }, [])

    // on checkbox change
    useEffect(() => {
        console.log("it done changed to " + isDone); 
    }, [isDone]);

    return (
        <TouchableOpacity
            style={[styles.container, {
                borderLeftColor: color,
            }]}
            activeOpacity={ 0.8 }
            onPress={() => {
                setIsDone(!isDone);
            }}
        >
            <Text style={{ color: "black"}}>{ title }</Text>
            <Checkbox 
                value={isDone}
                onValueChange={setIsDone}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderLeftWidth: 12,
        backgroundColor: "#ebebeb",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        margin: 2,
        marginTop: 0,
    },
});

export default Goal;