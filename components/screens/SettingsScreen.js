import React, { useContext, useEffect, useState } from "react";
import { Text, TextInput, View, ScrollView } from "react-native";
import { db } from "../common/globals";
import { Context } from "../common/Store";
import { colors, flexStyles, formStyles } from "../common/styles";
import Goal from "../Goal";

const SettingsScreen = ({navigation}) => {
    const [goals, setGoals] = useState([]);
    const [goalFilter, setGoalFilter] = useState("");

    const [storeState, ] = useContext(Context);

    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql(`
                    SELECT g.*, color
                    FROM Goals AS g JOIN GoalGroups USING(id_group)
                    ORDER BY id_group;
                `, [], (_, { rows }) => {
                setGoals(rows._array);
            }, (t, error) => {
                console.log(error);
            });
        });
    }, [storeState.forceUpdate]);

    return (
        <>
            <View style={[flexStyles.alignedRow, { padding: 10, alignItems: "center", backgroundColor: colors.colorBaseDark }]}>
                <Text>Search goal:</Text>
                <TextInput 
                    style = {[formStyles.textInput, { flex: 1, marginLeft: 10 }]}
                    value = {goalFilter}
                    onChangeText = {setGoalFilter}
                    placeholder = "Enter goal name"
                />
            </View>
            <ScrollView>
                {goals.filter(goal => goal.name.includes(goalFilter)).map(goal => {
                    return (
                        <Goal
                            key={goal.id_goal}
                            id={goal.id_goal}
                            title={goal.name}
                            color={goal.color}
                            isParent={true}
                            settingsMode={true}
                            navigation={navigation}
                        />
                    );
                })}
            </ScrollView>
        </>
    );
}

export default SettingsScreen;