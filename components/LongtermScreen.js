import React, { useEffect, useState } from "react";
import * as SQLite from "expo-sqlite";
import { StyleSheet, ScrollView, Text } from "react-native";
import Goal from "./Goal";
import FloatingButton from "./FloatingButton";

const db = SQLite.openDatabase("db.db");

const LongtermScreen = ({ navigation }) => {
    const [longterm, setLongterm] = useState([]);

    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql("SELECT * FROM Goals WHERE is_longterm;", [], (_, { rows }) => {
                setLongterm(rows._array);
            }, (t, error) => {
                console.log(error);
            })
        });
    }, []);

    return (
        <>
            <ScrollView style={ styles.container }>
                {longterm.map(longterm => {
                    return (<Goal id={longterm.id_reminder} title={longterm.name} />);
                })}
            </ScrollView>
            <FloatingButton text="+" navigation={navigation} navigateTo="AddGoal" isLongterm={ true } />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export default LongtermScreen;