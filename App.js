import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';
import RootStackScreen from './components/navigation/RootStackScreen';

//* Database
const db = SQLite.openDatabase("db.db");

//* App component
const App = () => {
    useEffect(() => {
        // create tables if they don't exist
        db.transaction((tx) => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS Goals (
                    id_goal INTEGER PRIMARY KEY AUTOINCREMENT,
                    name VARCHAR(100),
                    id_group INTEGER,
                    activity_length INTEGER,
                    is_longterm BOOLEAN,
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
        });
    }, [])

    return (
        <NavigationContainer>   
            <RootStackScreen />
        </NavigationContainer>
    );
}

export default App;