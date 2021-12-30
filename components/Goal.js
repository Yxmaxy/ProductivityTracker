import React, { useEffect, useState } from "react";
import { TouchableOpacity, Text } from "react-native";
import Checkbox from "expo-checkbox";
import { colors, goalStyles } from "./common/styles";
import { db } from "./common/globals";
import { currentDate } from "./common/globals";

const Goal = ({ id, title, color, isSmall, smallerGoals, parentIsDoneCallback, endingDate, isReminder }) => {
    const [isDone, setIsDone] = useState(false);
    const [isParent, setIsParent] = useState(false);
    const [isHidden, setIsHidden] = useState(false);

    // set initial value
    useEffect(() => {
        if (isReminder === undefined && id !== undefined && endingDate !== undefined) {
            db.transaction(tx => {
                if (!isSmall) {
                    tx.executeSql(`
                        SELECT * 
                        FROM GoalFinished
                        WHERE id_goal = ? AND date_finished = ?;
                    `, [id, endingDate || currentDate], (_, { rows }) => {
                        setIsDone(rows._array.length > 0);
                    }, (t, error) => {
                        console.log(error);
                    });
                } else {
                    tx.executeSql(`
                        SELECT * 
                        FROM SmallerGoalFinished
                        WHERE id_smaller_goal = ? AND date_finished = ?;
                    `, [id, endingDate || currentDate], (_, { rows }) => {
                        setIsDone(rows._array.length > 0);
                    }, (t, error) => {
                        console.log(error);
                    });
                }
            });
        }
    }, []);

    // on checkbox change
    useEffect(() => {
        db.transaction(tx => {
            if (isDone) {
                if (isReminder) {
                    tx.executeSql(`
                        DELETE FROM Reminders
                        WHERE id_reminder = ?;
                    `, [id, ], () => {
                        setIsHidden(true);
                    }, (t, error) => {
                        console.log(error);
                    });
                    return;
                }
                if (!isSmall) {
                    tx.executeSql(`
                        INSERT INTO GoalFinished(id_goal, date_finished)
                        VALUES (?, ?);
                    `, [id, endingDate || currentDate], () => {}, (t, error) => {
                        console.log(error);
                    });
                } else {
                    tx.executeSql(`
                        INSERT INTO SmallerGoalFinished(id_smaller_goal, date_finished)
                        VALUES (?, ?);
                    `, [id, endingDate || currentDate], () => {}, (t, error) => {
                        console.log(error);
                    });
                }
                
            } else {
                if (!isSmall) {
                    tx.executeSql(`
                        DELETE FROM GoalFinished
                        WHERE id_goal = ? AND date_finished = ?;
                    `, [id, endingDate || currentDate], () => {}, (t, error) => {
                        console.log(error);
                    });
                } else {
                    tx.executeSql(`
                        DELETE FROM SmallerGoalFinished
                        WHERE id_smaller_goal = ? AND date_finished = ?;
                    `, [id, endingDate || currentDate], () => {}, (t, error) => {
                        console.log(error);
                    });
                }
            }
        });
        // small goal reports to parent
        if (parentIsDoneCallback !== undefined) {
            parentIsDoneCallback();
        }   
    }, [isDone]);

    const checkIfDoneByChildren = () => {
        // set value for isParent
        setIsParent(smallerGoals !== undefined);

        // check if all children are done
        db.transaction(tx => {
            tx.executeSql(`
                SELECT *
                FROM SmallerGoals JOIN SmallerGoalFinished USING(id_smaller_goal)
                WHERE id_goal = ?
                AND date_finished = '${endingDate}';
            `, [id,], (_, { rows }) => {
                setIsDone(rows._array.length === smallerGoals.length);
            }, (t, error) => {
                console.log(error);
            });
        });
    }

    return (
        <>
            {!isHidden && <TouchableOpacity
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
                disabled={isParent}
            >
                <Text style={{ color: "black"}}>{ title }</Text>
                <Checkbox
                    color={ colors.colorPopDarkBlue }
                    value={isDone}
                    onValueChange={setIsDone}
                    disabled={isParent}
                />
            </TouchableOpacity>}
            {smallerGoals && smallerGoals.map(smallerGoal => {
                return (
                    <Goal
                        key={smallerGoal.id_smaller_goal}
                        id={smallerGoal.id_smaller_goal}
                        title={smallerGoal.name}
                        color={color}
                        isSmall={true}
                        endingDate={endingDate}
                        parentIsDoneCallback={ checkIfDoneByChildren }
                    />
                );
            })}
        </>
    );
}

export default Goal;