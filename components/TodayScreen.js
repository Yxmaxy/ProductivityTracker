import React, { useContext, useEffect, useState } from "react";
import * as SQLite from "expo-sqlite";
import { StyleSheet, ScrollView } from "react-native";
import Goal from "./Goal";
import FloatingButton from "./FloatingButton";
import { Context } from "./Store";
import GoalGroup from "./GoalGroup";

const db = SQLite.openDatabase("db.db");

const TodayScreen = ({ navigation }) => {
    const [goalsWeek, setGoalsWeek] = useState([]);
    const [goalsMonth, setGoalsMonth] = useState([]);
    const [goalsYear, setGoalsYear] = useState([]);
    const [goalsCustom, setGoalsCustom] = useState([]);

    const [storeState, ] = useContext(Context);

    useEffect(() => {
        db.transaction((tx) => {
            /*tx.executeSql(`
                SELECT first_date, num_available_before, num_days_between, (round(julianday('now') - julianday(first_date) - 1)) AS dateDiff 
                FROM GoalCustom JOIN Goals USING(id_goal);
            `, [], (_, { rows }) => {
                console.log(rows._array);
            }, (t, error) => {
                console.log(error);
            });*/

            // Yearly goals
            tx.executeSql(`
                    SELECT *,
                    substr(DATE('now'), 6) AS d1,
                    substr(date, 6) AS d2,
                    substr(DATE(date, '-' || num_available_before || ' days'), 6) AS dateDiff
                    FROM GoalYear JOIN Goals USING(id_goal)
                    WHERE substr(DATE('now'), 6) BETWEEN dateDiff AND substr(date, 6);
                `, [], (_, { rows }) => {
                //console.log(rows._array);
                setGoalsYear(rows._array);
            }, (t, error) => {
                console.log(error);
            });
            // Custom goals
            tx.executeSql(`
                    SELECT *,
                    ((round(julianday('now') - julianday(first_date) - 1)) % num_days_between) AS dateDiff
                    FROM GoalCustom JOIN Goals USING(id_goal)
                    WHERE dateDiff IS null OR dateDiff = 0 OR dateDiff >= num_days_between - num_available_before;
                `, [], (_, { rows }) => {
                //console.log(rows._array);
                setGoalsCustom(rows._array);
            }, (t, error) => {
                console.log(error);
            });
        });
    }, [storeState.forceUpdate]);

    return (
        <>
            <ScrollView>
                <GoalGroup title="Weekly goals">
                    {goalsWeek.map(goal => {
                        return (<Goal key={goal.id_goal} title={goal.name} />);
                    })}
                </GoalGroup>
                <GoalGroup title="Monthly goals">
                    
                </GoalGroup>
                <GoalGroup title="Yearly goals">
                    {goalsYear.map(goal => {
                        return (<Goal key={goal.id_goal} title={goal.name} />);
                    })}
                </GoalGroup>
                <GoalGroup title="Custom goals">
                    {goalsCustom.map(goal => {
                        return (<Goal key={goal.id_goal} title={goal.name} />);
                    })}
                </GoalGroup>
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