import React, { useEffect, useState } from "react";
import { TouchableOpacity, Text } from "react-native";
import Checkbox from "expo-checkbox";
import * as SQLite from "expo-sqlite";
import { goalStyles } from "./common/styles";

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
            style={[goalStyles.goal, {
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

export default Goal;