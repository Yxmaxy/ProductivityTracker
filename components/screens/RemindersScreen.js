import React, { useContext, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import FloatingButton from "../FloatingButton";
import Goal from "../Goal";
import { Context } from "../common/Store";
import { flexStyles, floatingButtonStyles } from "../common/styles";
import { db } from "../common/globals";

const RemindersScreen = ({ navigation }) => {
    const [goals, setGoals] = useState([]);
    const [storeState, ] = useContext(Context);

    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql("SELECT * FROM Reminders;", [], (_, { rows }) => {
                setGoals(rows._array);
            }, (t, error) => {
                console.log(error);
            });
        });
    }, [storeState.forceUpdate]);

    return(
        <>
            <ScrollView style={ flexStyles.container }>
                {goals.map(goal => {
                    return (<Goal 
                        key={goal.id_reminder}
                        id={goal.id_reminder}
                        title={goal.name}
                        isReminder={true}
                    />);
                })}
                <View style={floatingButtonStyles.containerWithMargin} />
            </ScrollView>
            <FloatingButton text="+" navigation={navigation} navigateTo="AddReminder" />
        </>
    );
}

export default RemindersScreen;