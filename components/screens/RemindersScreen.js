import React, { useContext, useEffect, useState } from "react";
import { ScrollView } from "react-native";
import FloatingButton from "../FloatingButton";
import Goal from "../Goal";
import { Context } from "../common/Store";
import { flexContainer } from "../common/styles";
import { db } from "../common/globals";

const RemindersScreen = ({ navigation }) => {
    const [reminders, setReminders] = useState([]);
    const [storeState, ] = useContext(Context);

    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql("SELECT * FROM Reminders;", [], (_, { rows }) => {
                setReminders(rows._array);
            }, (t, error) => {
                console.log(error);
            });
        });
    }, [storeState.forceUpdate]);

    return(
        <>
            <ScrollView style={ flexContainer.container }>
                {reminders.map(reminder => {
                    return (<Goal key={reminder.id_reminder} title={reminder.name} />);
                })}
            </ScrollView>
            <FloatingButton text="+" navigation={navigation} navigateTo="AddReminder" />
        </>
    );
}

export default RemindersScreen;