import React, { useEffect, useState } from "react";
import * as SQLite from "expo-sqlite";
import { StyleSheet, ScrollView } from "react-native";
import Goal from "./Goal";
import FloatingButton from './FloatingButton';

const db = SQLite.openDatabase("db.db");

const TodayScreen = ({ navigation }) => {
    const [goals, setGoals] = useState([]);

    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql("SELECT * FROM Goals WHERE NOT is_longterm;", [], (_, { rows }) => {
                setGoals(rows._array);
            }, (t, error) => {
                console.log(error);
            })
        });
    }, []);

    return (
        <>
            <ScrollView>
                {goals.map(goal => {
                    return (<Goal id={goal.id_reminder} title={goal.name} />);
                })}
            </ScrollView>
            <FloatingButton text="+" navigation={navigation} navigateTo="AddGoal" />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export default TodayScreen;