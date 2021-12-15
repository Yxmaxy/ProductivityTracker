import React, { useContext, useEffect, useState } from "react";
import * as SQLite from "expo-sqlite";
import { StyleSheet, ScrollView, View } from "react-native";
import Goal from "./Goal";
import FloatingButton from "./FloatingButton";
import { Context } from "./Store";
import SmallerGoal from "./SmallerGoal";

const db = SQLite.openDatabase("db.db");

const LongtermScreen = ({ navigation }) => {
    const [longterm, setLongterm] = useState([]);
    const [smallerGoals, setSmallerGoals] = useState({});

    const [storeState, ] = useContext(Context);

    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql("SELECT * FROM Goals WHERE is_longterm;", [], (_, { rows }) => {
                setLongterm(rows._array);
            }, (t, error) => {
                console.log(error);
            });
        });
    }, [storeState.forceUpdate]);

    useEffect(() => {
        var goalIDs = [];
        longterm.forEach(goal => {
            goalIDs.push(goal.id_goal);
        });
        db.transaction((tx) => {
            tx.executeSql("SELECT * FROM SmallerGoals WHERE id_goal IN (" + goalIDs.join(", ") + ");", [], (_, { rows }) => {
                setSmallerGoals(rows._array.reduce((r, a) => {
                    r[a.id_goal] = r[a.id_goal] || [];
                    r[a.id_goal].push(a);
                    return r;
                }, Object.create(null)));
            }, (t, error) => {
                console.log(error);
            });
        });
    }, [longterm]);

    return (
        <>
            <ScrollView style={ styles.container }>
                {longterm.map(longterm => {
                    return (
                        <View>
                            <Goal key={longterm.id_goal} title={longterm.name} />
                            {smallerGoals[longterm.id_goal] && smallerGoals[longterm.id_goal].map(smallerGoal => {
                                return <SmallerGoal key={smallerGoal.id_smaller_goal} title={smallerGoal.name} />
                            })}
                        </View>
                    );
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