import React, { useContext, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import Goal from "../Goal";
import FloatingButton from "../FloatingButton";
import { Context } from "../common/Store";
import SmallerGoal from "../SmallerGoal";
import { flexContainer } from "../common/styles";
import { db } from "../common/globals";

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
            <ScrollView style={ flexContainer.container }>
                {longterm.map(longterm => {
                    return (
                        <View key={longterm.id_goal}>
                            <Goal title={longterm.name} />
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

export default LongtermScreen;