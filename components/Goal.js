import React, { useEffect, useState } from "react";
import { TouchableOpacity, Text } from "react-native";
import Checkbox from "expo-checkbox";
import { checkboxStyles, colors, goalStyles } from "./common/styles";
import { db } from "./common/globals";

const Goal = ({ id, title, color, isSmall }) => {
    const [isDone, setIsDone] = useState(false);

    // set initial value
    useEffect(() => {
        if (id !== undefined) {
            db.transaction(tx => {
                const currentDate = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate();
                tx.executeSql(`
                    SELECT * 
                    FROM GoalFinished
                    WHERE id_goal = ? AND date_finished = ? ;
                `, [id, currentDate], (_, { rows }) => {
                    setIsDone(rows._array.length > 0);
                }, (t, error) => {
                    console.log(error);
                });
            });
        }
    }, [])

    // on checkbox change
    useEffect(() => {
        console.log("it done changed to " + isDone); 
    }, [isDone]);

    return (
        <TouchableOpacity
            style={[goalStyles.goal, {
                borderLeftColor: color,
                borderLeftWidth: (color === undefined) ? 0 : (isSmall) ? 6 : 12,
                padding: (isSmall) ? 4 : 10,
                marginLeft: (isSmall) ? 12 : 0,
                paddingRight: 10,
            }]}
            activeOpacity={ 0.8 }
            onPress={() => {
                setIsDone(!isDone);
            }}
        >
            <Text style={{ color: "black"}}>{ title }</Text>
            <Checkbox
                color={ colors.colorPopDarkBlue }
                value={isDone}
                onValueChange={setIsDone}
            />
        </TouchableOpacity>
    );
}

export default Goal;