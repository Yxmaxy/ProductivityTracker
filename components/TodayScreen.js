import React, { useContext, useEffect, useState } from "react";
import * as SQLite from "expo-sqlite";
import { StyleSheet, ScrollView } from "react-native";
import Goal from "./Goal";
import FloatingButton from './FloatingButton';
import { Context } from "./Store";

const db = SQLite.openDatabase("db.db");

const TodayScreen = ({ navigation }) => {
    const [goals, setGoals] = useState([]);

    const [storeState, ] = useContext(Context);

    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql("SELECT * FROM Goals WHERE NOT is_longterm;", [], (_, { rows }) => {
                setGoals(rows._array);
            }, (t, error) => {
                console.log(error);
            })
        });
    }, [storeState.forceUpdate]);

    return (
        <>
            <ScrollView>
                {goals.map(goal => {
                    return (<Goal key={goal.id_reminder} title={goal.name} />);
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