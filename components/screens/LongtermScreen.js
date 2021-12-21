import React, { useContext, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import Goal from "../Goal";
import FloatingButton from "../FloatingButton";
import { Context } from "../common/Store";
import SmallerGoal from "../SmallerGoal";
import { flexStyles } from "../common/styles";
import { db } from "../common/globals";

const LongtermScreen = ({ navigation }) => {
    const [goals, setGoals] = useState([]);
    const [smallerGoals, setSmallerGoals] = useState({});

    const [storeState, ] = useContext(Context);

    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql(`
                SELECT g.*, color
                FROM Goals AS g JOIN GoalGroups USING(id_group)
                WHERE is_longterm;
            `, [], (_, { rows }) => {
                setGoals(rows._array);
            }, (t, error) => {
                console.log(error);
            });
        });
    }, [storeState.forceUpdate]);

    useEffect(() => {
        var goalIDs = [];
        goals.forEach(goal => {
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
    }, [goals]);

    return (
        <>
            <ScrollView style={ flexStyles.container }>
                {goals.map(goal => {
                    return (
                        <View key={goal.id_goal}>
                            <Goal
                                id={goal.id_goal}
                                title={goal.name}
                                color={goal.color}
                            />
                            {smallerGoals[goal.id_goal] && smallerGoals[goal.id_goal].map(smallerGoal => {
                                return (<Goal
                                    id={smallerGoal.id_goal}
                                    title={smallerGoal.name}
                                    color={goal.color}
                                    isSmall={true}
                                />)
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