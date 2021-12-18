import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';
import RootStackScreen from './components/navigation/RootStackScreen';
import Store from './components/Store';

//* Database
const db = SQLite.openDatabase("db.db");

//* App component
const App = () => {
    useEffect(() => {
        // create tables if they don't exist
        db.transaction((tx) => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS GoalGroups (
                    id_group INTEGER PRIMARY KEY AUTOINCREMENT,
                    name VARCHAR(100),
                    color CHAR(7)
                );`
            );
            tx.executeSql(
                `INSERT INTO GoalGroups(id_group, name, color)
                VALUES (1, "Default", "#000000");`
            );
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS Goals (
                    id_goal INTEGER PRIMARY KEY AUTOINCREMENT,
                    name VARCHAR(100),
                    id_group INTEGER,
                    activity_length INTEGER,
                    is_longterm BOOLEAN,
                    date_started DATE,
                    FOREIGN KEY(id_group) REFERENCES GoalGroups(id_group)
                );`
            );
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS Reminders (
                    id_reminder INTEGER PRIMARY KEY AUTOINCREMENT,
                    name VARCHAR(100),
                    notify_when DATETIME
                );`
            );
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS SmallerGoals (
                    id_smaller_goal INTEGER PRIMARY KEY AUTOINCREMENT,
                    name VARCHAR(100),
                    id_goal INTEGER,
                    FOREIGN KEY(id_goal) REFERENCES Goals(id_goal)
                );`
            );
            tx.executeSql(
                `CREATE TABLE GoalYear (
                    id_goal INTEGER,
                    date DATE,
                    num_available_before INTEGER,
                    PRIMARY KEY(id_goal, date),
                    FOREIGN KEY(id_goal) REFERENCES Goals(id_goal)
                );`
            );
            tx.executeSql(
                `CREATE TABLE GoalMonth (
                    id_goal INTEGER,
                    day INTEGER,
                    num_available_before INTEGER,
                    PRIMARY KEY(id_goal, day),
                    FOREIGN KEY(id_goal) REFERENCES Goals(id_goal)
                );`
            );
            tx.executeSql(
                `CREATE TABLE GoalWeek (
                    id_goal INTEGER,
                    day INTEGER,
                    PRIMARY KEY(id_goal, day),
                    FOREIGN KEY(id_goal) REFERENCES Goals(id_goal)
                );`
            );
            tx.executeSql(
                `CREATE TABLE GoalCustom (
                    id_goal INTEGER,
                    first_date DATE,
                    num_days_between INTEGER,
                    num_available_before INTEGER,
                    PRIMARY KEY(id_goal, first_date),
                    FOREIGN KEY(id_goal) REFERENCES Goals(id_goal)
                );`
            );
            // 15 % num_days_between == 0 or 15 % num_days_between >= num_days_between - num_days_before
        });
    }, [])

    return (
        <Store>
            <NavigationContainer>   
                <RootStackScreen />
            </NavigationContainer>
        </Store>
    );
}

export default App;