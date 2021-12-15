import React, { useContext, useEffect, useState } from "react";
import * as SQLite from "expo-sqlite";
import { StyleSheet, ScrollView, Text } from "react-native";
import Goal from "./Goal";
import FloatingButton from "./FloatingButton";
import { Context } from "./Store";

const db = SQLite.openDatabase("db.db");

const LongtermScreen = ({ navigation }) => {
    const [longterm, setLongterm] = useState([]);

    const [storeState, ] = useContext(Context);

    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql("SELECT * FROM Goals WHERE is_longterm;", [], (_, { rows }) => {
                setLongterm(rows._array);
            }, (t, error) => {
                console.log(error);
            })
        });
    }, [storeState.forceUpdate]);

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