import React, { useContext, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import Goal from "../Goal";
import FloatingButton from "../FloatingButton";
import { Context } from "../common/Store";
import GoalGroup from "../GoalGroup";
import { db } from "../common/globals";

const TodayScreen = ({ navigation }) => {
    const [goalsWeek, setGoalsWeek] = useState([]);
    const [goalsMonth, setGoalsMonth] = useState([]);
    const [goalsYear, setGoalsYear] = useState([]);
    const [goalsCustom, setGoalsCustom] = useState([]);
    const [smallerGoals, setSmallerGoals] = useState({});

    const [storeState, ] = useContext(Context);

    //* effect to get all goals
    useEffect(() => {
        db.transaction((tx) => {
            // Weekly goals
            tx.executeSql(`
                    SELECT g.*, color
                    FROM GoalWeek JOIN Goals AS g USING(id_goal) JOIN GoalGroups USING(id_group)
                    WHERE strftime('%w', 'now') = day
                    AND DATE('now') >= date_started
                    ORDER BY id_group;
                `, [], (_, { rows }) => {
                //console.log(rows._array);
                setGoalsWeek(rows._array);
            }, (t, error) => {
                console.log(error);
            });
            // Monthly goals
            tx.executeSql(`
                    SELECT g.*, color, day, (strftime('%Y-%m-','now') || day) AS endingDate
                    FROM GoalMonth JOIN Goals AS g USING(id_goal) JOIN GoalGroups USING(id_group)
                    WHERE CAST(strftime('%d','now') AS Integer) BETWEEN day - num_available_before AND day
                    AND DATE('now') >= date_started
                    ORDER BY id_group;
                `, [], (_, { rows }) => {
                //console.log(rows._array);
                setGoalsMonth(rows._array);
            }, (t, error) => {
                console.log(error);
            });
            // Yearly goals
            tx.executeSql(`
                    SELECT g.*, color, date, (strftime('%Y-','now') || strftime('%m-%d', date)) AS endingDate,
                    substr(DATE(date, '-' || num_available_before || ' days'), 6) AS dateDiff
                    FROM GoalYear JOIN Goals AS g USING(id_goal) JOIN GoalGroups USING(id_group)
                    WHERE substr(DATE('now'), 6) BETWEEN dateDiff AND substr(date, 6)
                    AND DATE('now') >= date_started
                    ORDER BY id_group;
                `, [], (_, { rows }) => {
                //console.log(rows._array);
                setGoalsYear(rows._array);
            }, (t, error) => {
                console.log(error);
            });
            // Custom goals
            tx.executeSql(`
                    SELECT g.*, color, first_date, num_days_between, num_available_before,
                    ((round(julianday(strftime('%Y-%m-%d', 'now')) - julianday(first_date))) % num_days_between) AS dateDiff
                    FROM GoalCustom JOIN Goals AS g USING(id_goal) JOIN GoalGroups USING(id_group)
                    WHERE dateDiff = 0 OR dateDiff >= num_days_between - num_available_before
                    AND DATE('now') >= date_started
                    ORDER BY id_group;
                `, [], (_, { rows }) => {
                //console.log(rows._array);
                setGoalsCustom(rows._array);
            }, (t, error) => {
                console.log(error);
            });
        });
    }, [storeState.forceUpdate]);

    //* effect for smaller goals
    useEffect(() => {
        var goalIDs = [];
        goalsWeek.forEach(goal => {
            goalIDs.push(goal.id_goal);
        });
        goalsMonth.forEach(goal => {
            goalIDs.push(goal.id_goal);
        });
        goalsYear.forEach(goal => {
            goalIDs.push(goal.id_goal);
        });
        goalsCustom.forEach(goal => {
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
    }, [goalsWeek, goalsMonth, goalsYear, goalsCustom]);

    return (
        <>
            <ScrollView>
                <GoalGroup title="Weekly goals">
                    {goalsWeek.map(goal => {
                        return (
                            <Goal
                                key={goal.id_goal}
                                id={goal.id_goal}
                                title={goal.name}
                                color={goal.color}
                                smallerGoals={smallerGoals[goal.id_goal]}
                            />
                        );
                    })}
                </GoalGroup>
                <GoalGroup title="Monthly goals">
                    {goalsMonth.map(goal => {
                        return (
                            <Goal
                                key={goal.id_goal}
                                id={goal.id_goal}
                                title={goal.name}
                                color={goal.color}
                                smallerGoals={smallerGoals[goal.id_goal]}
                                endingDate={goal.endingDate}
                            />
                        );
                    })}
                </GoalGroup>
                <GoalGroup title="Yearly goals">
                    {goalsYear.map(goal => {
                        return (
                            <Goal
                                key={goal.id_goal}
                                id={goal.id_goal}
                                title={goal.name}
                                color={goal.color}
                                smallerGoals={smallerGoals[goal.id_goal]}
                                endingDate={goal.endingDate}
                            />
                        );
                    })}
                </GoalGroup>
                <GoalGroup title="Custom goals">
                    {goalsCustom.map(goal => {
                        return (
                            <Goal
                                key={goal.id_goal}
                                id={goal.id_goal}
                                title={goal.name}
                                color={goal.color}
                                smallerGoals={smallerGoals[goal.id_goal]}
                                endingDate={goal.endingDate}
                            />
                        );
                    })}
                </GoalGroup>
            </ScrollView>
            <FloatingButton text="+" navigation={navigation} navigateTo="AddGoal" />
        </>
    );
}

export default TodayScreen;