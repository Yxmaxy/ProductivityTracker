import React, { useContext, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import Goal from "../Goal";
import FloatingButton from "../FloatingButton";
import { Context } from "../common/Store";
import { flexStyles, floatingButtonStyles } from "../common/styles";
import { currentDate, db } from "../common/globals";
import GoalGroup from "../GoalGroup";

const LongtermScreen = ({ navigation }) => {
    const [goals, setGoals] = useState([]);
    const [smallerGoals, setSmallerGoals] = useState({});
    const [goalsByGroup, setGoalsByGroup] = useState({});

    const [storeState, ] = useContext(Context);

    //* effect to get longterm goals
    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql(`
                SELECT g.*, color, gr.name AS group_name
                FROM Goals AS g JOIN GoalGroups AS gr USING(id_group)
                WHERE is_longterm;
            `, [], (_, { rows }) => {
                setGoals(rows._array);
            }, (t, error) => {
                console.log(error);
            });
        });
    }, [storeState.forceUpdate]);

    //* effect for sorting goals by groups
    useEffect(() => {
        setGoalsByGroup(goals.reduce((r, a) => {
            r[a.group_name] = r[a.group_name] || [];
            r[a.group_name].push(a);
            return r;
        }, Object.create(null)));
    }, [goals]);

    //* effect for smaller goals
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
                {Object.entries(goalsByGroup).map((group) => {
                    return (
                        <GoalGroup key={group[0]} title={group[0]}>
                            {group[1].map(goal => {
                                return (
                                    <Goal
                                        key={goal.id_goal}
                                        id={goal.id_goal}
                                        title={goal.name}
                                        color={goal.color}
                                        smallerGoals={smallerGoals[goal.id_goal]}
                                        endingDate={currentDate}
                                    />
                                );
                            })}
                        </GoalGroup>
                    );
                })}
                <View style={floatingButtonStyles.containerWithMargin} />
            </ScrollView>
            <FloatingButton text="+" navigation={navigation} navigateTo="AddGoal" isLongterm={ true } />
        </>
    );
}

export default LongtermScreen;