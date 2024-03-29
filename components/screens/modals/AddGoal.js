import React, { useContext, useEffect, useState } from 'react';
import { Text, TextInput, Pressable, KeyboardAvoidingView, Button, View, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Checkbox from 'expo-checkbox';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Context } from '../../common/Store';
import { colors, flexStyles, formStyles } from '../../common/styles';
import { currentDate, db } from '../../common/globals';

const AddGoal = ({ route, navigation }) => {
    const [name, setName] = useState((route.params.goalData) ? route.params.goalData.name : "");
    const [smallerGoalName, setSmallerGoalName] = useState("");
    const [smallerGoals, setSmallerGoals] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState((route.params.goalData) ? route.params.goalData.id_group : 1);
    const [selectedFrequency, setSelectedFrequency] = useState("week");
    const [daysBeforeDeadline, setDaysBeforeDeadline] = useState(0);
    const [goalGroups, setGoalGroups] = useState([]);
    const [isLongterm, setIsLongterm] = useState((route.params.goalData) ? (route.params.goalData.is_longterm === 1) : route.params.isLongterm);
    const [weekSelectedDays, setWeekSelectedDays] = useState([]);
    const [monthSelectedDay, setMonthSelectedDay] = useState(1);
    const [calendarSelectedDay, setCalendarSelectedDay] = useState(new Date());
    const [showCalendar, setShowCalendar] = useState(false);
    const [customDaysBetween, setCustomDaysBetween] = useState(0);

    const [storeState, storeDispatch] = useContext(Context);

    // effect fills data when editing
    useEffect(() => {
        if (route.params.goalData) {
            db.transaction(tx => {
                //* check goal type
                // weekly
                tx.executeSql(`
                    SELECT *
                    FROM Goals JOIN GoalWeek USING(id_goal)
                    WHERE id_goal = ?;
                `, [route.params.goalData.id_goal], (_, { rows }) => {
                    if (rows._array.length > 0) {
                        setSelectedFrequency("week");
                        const weekSelectedDaysTemp = [... weekSelectedDays];
                        rows._array.forEach(goal => {
                            weekSelectedDaysTemp[(goal.day == 0) ? 6 : goal.day - 1] = true;
                            setWeekSelectedDays(weekSelectedDaysTemp);
                        });
                    }
                }, (t, error) => {
                    console.log(error);
                });
                // monthly
                tx.executeSql(`
                    SELECT *
                    FROM Goals JOIN GoalMonth USING(id_goal)
                    WHERE id_goal = ?;
                `, [route.params.goalData.id_goal], (_, { rows }) => {
                    if (rows._array.length > 0) {
                        setSelectedFrequency("month");
                        setMonthSelectedDay(rows._array[0].day);
                        setDaysBeforeDeadline(rows._array[0].num_available_before);
                    }
                }, (t, error) => {
                    console.log(error);
                });
                // yearly
                tx.executeSql(`
                    SELECT *
                    FROM Goals JOIN GoalYear USING(id_goal)
                    WHERE id_goal = ?;
                `, [route.params.goalData.id_goal], (_, { rows }) => {
                    if (rows._array.length > 0) {
                        setSelectedFrequency("year");
                        setCalendarSelectedDay(new Date(rows._array[0].date));
                        setDaysBeforeDeadline(rows._array[0].num_available_before);
                    }
                }, (t, error) => {
                    console.log(error);
                });
                // custom
                tx.executeSql(`
                    SELECT *
                    FROM Goals JOIN GoalCustom USING(id_goal)
                    WHERE id_goal = ?;
                `, [route.params.goalData.id_goal], (_, { rows }) => {
                    if (rows._array.length > 0) {
                        setSelectedFrequency("custom");
                        setCalendarSelectedDay(new Date(rows._array[0].first_date));
                        setDaysBeforeDeadline(rows._array[0].num_available_before);
                        setCustomDaysBetween(rows._array[0].num_days_between);
                    }
                }, (t, error) => {
                    console.log(error);
                });

                //* smaller goals
                tx.executeSql(`
                    SELECT *
                    FROM Goals JOIN SmallerGoals USING(id_goal)
                    WHERE id_goal = ?;
                `, [route.params.goalData.id_goal], (_, { rows }) => {
                    const smallerGoalsTemp = [];
                    rows._array.forEach(smallerGoal => {
                        smallerGoalsTemp.push(smallerGoal.name);
                    })
                    setSmallerGoals(smallerGoalsTemp);
                }, (t, error) => {
                    console.log(error);
                });
            });
        }
    }, []);

    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql("SELECT * FROM GoalGroups;", [], (_, { rows }) => {
                setGoalGroups(rows._array);
            }, (t, error) => {
                console.log(error);
            });
        });
    }, [storeState.forceUpdate]);

    return (
        <>
            <KeyboardAvoidingView style={ flexStyles.container }>
                <ScrollView>
                    <View style={flexStyles.containerMargin}>
                        <View style={formStyles.formRow}>
                            <Text>Name</Text>
                            <TextInput
                                style= {formStyles.textInput}
                                value={name}
                                onChangeText={ setName }
                                placeholder="Enter name of goal"
                            />
                        </View>
                        <View style={formStyles.formRow}>
                            <Text>Group</Text>
                            <View style={ flexStyles.alignedRow }>
                                <Picker
                                    style={{
                                        flex: 1,
                                        backgroundColor: colors.colorBaseLight,
                                    }}
                                    selectedValue={selectedGroup}
                                    onValueChange={(itemValue,) => {
                                        setSelectedGroup(itemValue);
                                }}>
                                    {goalGroups.map(group => {
                                        return (
                                            <Picker.Item key={ group.id_group } label={ group.name } value={ group.id_group } style={{
                                                color: group.color,
                                            }}/>
                                        );
                                    })}
                                </Picker>
                                <Pressable
                                    style={ formStyles.button }
                                    onPress={() => {
                                        navigation.navigate("AddGroup");
                                    }}
                                    android_ripple={{
                                        color: "white",
                                        borderless: true,
                                    }}
                                >
                                    <Text>+</Text>
                                </Pressable>
                            </View>
                        </View>
                        <View style={[formStyles.formRow, flexStyles.alignedRow]}>
                            <Text>Is longterm?</Text>
                            <Checkbox 
                                value={isLongterm}
                                onValueChange={setIsLongterm}
                                color={ colors.colorPopDarkBlue }
                            />
                        </View>
                        { !isLongterm && <View>
                            <View style={formStyles.formRow}>
                                <Text>Frequency</Text>
                                <Picker
                                    style={{
                                        backgroundColor: colors.colorBaseLight,
                                    }}
                                    selectedValue={selectedFrequency}
                                    onValueChange={(itemValue, itemIndex) => {
                                        setSelectedFrequency(itemValue);
                                    }}>
                                    <Picker.Item key={1} label="Weekly" value="week" />
                                    <Picker.Item key={2} label="Monthly" value="month" />
                                    <Picker.Item key={3} label="Yearly" value="year" />
                                    <Picker.Item key={4} label="Custom" value="custom" />
                                </Picker>
                            </View>
                            
                            <View style={formStyles.formRow}>
                                { selectedFrequency == "week" && <>
                                <Text>Select days</Text>
                                    <View style={ flexStyles.alignedRow }>
                                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
                                            return (
                                                <View key={i}>
                                                    <Text>{ day }</Text>
                                                    <Checkbox 
                                                        value={weekSelectedDays[i]}
                                                        onValueChange={value => {
                                                            const arr = [... weekSelectedDays];
                                                            arr[i] = value;
                                                            setWeekSelectedDays(arr);
                                                        }}
                                                        color={ colors.colorPopDarkBlue }
                                                    />
                                                </View>
                                            );
                                        })}
                                    </View>
                                </>}

                                { selectedFrequency == "month" && <>
                                    <Text>Select day in month</Text>
                                    <View style={ flexStyles.alignedRow }>
                                        <TextInput 
                                            style={[ formStyles.textInput, { flex: 1 } ]}
                                            value={ monthSelectedDay.toString() }
                                            onChangeText={value => {
                                                if (value >= 0 && value <= 31)
                                                    setMonthSelectedDay(value);
                                            }}
                                            keyboardType="numeric"
                                        />
                                    </View>
                                </>}

                                { selectedFrequency == "year" && <>
                                    <TouchableOpacity onPress={() => { setShowCalendar(true); }}>
                                        <Text>Select date</Text>
                                        <Text>{`${calendarSelectedDay.getDate()}. ${(calendarSelectedDay.getMonth() + 1)}.`}</Text>
                                    </TouchableOpacity>
                                </>}

                                { selectedFrequency == "custom" && <>
                                    <TouchableOpacity onPress={() => setShowCalendar(true)} style={formStyles.formRow}>
                                        <Text>Select first date</Text>
                                        <Text>{`${calendarSelectedDay.getDate()}. ${(calendarSelectedDay.getMonth() + 1)}. ${calendarSelectedDay.getFullYear()}`}</Text>
                                    </TouchableOpacity>
                                    <Text>Select number of days between goals</Text>
                                    <View style={ flexStyles.alignedRow }>
                                        <TextInput 
                                            style={[ formStyles.textInput, { flex: 1 } ]}
                                            value={ customDaysBetween.toString() }
                                            onChangeText={value => {
                                                if (value >= 0 && value !== "")
                                                    setCustomDaysBetween(parseInt(value));
                                                else if (value === "")
                                                    setCustomDaysBetween(0);
                                            }}
                                            keyboardType="numeric"
                                        />
                                        <Pressable
                                            style={[formStyles.button, formStyles.buttomMarginRound]}
                                            onPress={() => {
                                                setCustomDaysBetween(customDaysBetween + 1);
                                            }}
                                            android_ripple={{
                                                color: "white",
                                                borderless: true,
                                            }}
                                        >
                                            <Text>+</Text>
                                        </Pressable>
                                        <Pressable
                                            style={[formStyles.button, formStyles.buttomMarginRound]}
                                            onPress={() => {
                                                if (customDaysBetween > 0)
                                                    setCustomDaysBetween(customDaysBetween - 1);
                                            }}
                                            android_ripple={{
                                                color: "white",
                                                borderless: true,
                                            }}
                                        >
                                            <Text>-</Text>
                                        </Pressable>
                                    </View>
                                </>}
                            </View>
                            { selectedFrequency != "week" && <View style={formStyles.formRow}>
                                <Text>Days available before deadline</Text>
                                <View style={ flexStyles.alignedRow }>
                                    <TextInput 
                                        style={[ formStyles.textInput, { flex: 1 } ]}
                                        value={ daysBeforeDeadline.toString() }
                                        onChangeText={ value => {
                                            if (value !== "")
                                                setDaysBeforeDeadline(parseInt(value))
                                            else
                                                setDaysBeforeDeadline(0);
                                        }}
                                        keyboardType="numeric"
                                    />
                                    <Pressable
                                        style={[formStyles.button, formStyles.buttomMarginRound]}
                                        onPress={() => {
                                            setDaysBeforeDeadline(daysBeforeDeadline + 1);
                                        }}
                                        android_ripple={{
                                            color: "white",
                                            borderless: true,
                                        }}
                                    >
                                        <Text>+</Text>
                                    </Pressable>
                                    <Pressable
                                        style={[formStyles.button, formStyles.buttomMarginRound]}
                                        onPress={() => {
                                            if (daysBeforeDeadline > 0)
                                                setDaysBeforeDeadline(daysBeforeDeadline - 1);
                                        }}
                                        android_ripple={{
                                            color: "white",
                                            borderless: true,
                                        }}
                                    >
                                        <Text>-</Text>
                                    </Pressable>
                                </View>
                            </View>}
                        </View>}
                        <View style={formStyles.formRow}>
                            <Text>Smaller goals</Text>
                            <View style={[ flexStyles.alignedRow, formStyles.formSmallerRow ]}>
                                <TextInput
                                    style= {[ formStyles.textInput , {flex: 1}]}
                                    value={ smallerGoalName }
                                    onChangeText={ setSmallerGoalName }
                                    placeholder="Enter name of smaller goal"
                                />
                                <Pressable
                                    style={[formStyles.button, formStyles.buttomMarginRound]}
                                    onPress={() => {
                                        setSmallerGoals([...smallerGoals, smallerGoalName]);
                                        setSmallerGoalName("");
                                    }}
                                    android_ripple={{
                                        color: "white",
                                        borderless: true,
                                    }}
                                >
                                    <Text>Add</Text>
                                </Pressable>
                            </View>
                            {smallerGoals.map((smallerGoal, index) => {
                                return <SmallerGoal 
                                    key={index} 
                                    name={smallerGoal} 
                                    smallerGoals={smallerGoals} 
                                    setSmallerGoals={setSmallerGoals}
                                />;
                            })}
                        </View>

                        {showCalendar && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                timeZoneOffsetInMinutes={0}
                                value={ calendarSelectedDay }
                                mode={"date"}
                                display="default"
                                onChange={(event, selectedValue) => {
                                    const selectedDate = selectedValue || new Date();
                                    setShowCalendar(false);
                                    setCalendarSelectedDay(selectedDate);
                                }}
                            />
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
            <Pressable
                style={formStyles.submitButton}
                onPress={() => {
                    const selectedDate = calendarSelectedDay.getFullYear() + "-" + ("0" + (calendarSelectedDay.getMonth() + 1)).slice(-2) + "-" + ("0" + calendarSelectedDay.getDate()).slice(-2);
                    if (!route.params.goalData) {
                        db.transaction((tx) => {
                            // insert goals
                            tx.executeSql("INSERT INTO Goals(name, id_group, is_longterm, date_started) VALUES (?, ?, ?, ?);", [name, selectedGroup, isLongterm, currentDate], (_, resultSet) => {
                                const goalId = resultSet.insertId;
                                // insert smaller goals
                                smallerGoals.forEach(smallerGoalName => {
                                    tx.executeSql("INSERT INTO SmallerGoals(name, id_goal) VALUES (?, ?);", [smallerGoalName, goalId], () => {}, (t, error) => {
                                        console.log(error);
                                    });
                                });
                                // insert depending on frequency
                                switch (selectedFrequency) {
                                    case "year":
                                        tx.executeSql("INSERT INTO GoalYear(id_goal, date, num_available_before) VALUES (?, ?, ?);", [goalId, selectedDate, daysBeforeDeadline], () => {}, (t, error) => {
                                            console.log(error);
                                        });
                                        break;
                                    case "month":
                                        tx.executeSql("INSERT INTO GoalMonth(id_goal, day, num_available_before) VALUES (?, ?, ?);", [goalId, monthSelectedDay, daysBeforeDeadline], () => {}, (t, error) => {
                                            console.log(error);
                                        });
                                        break;
                                    case "week":
                                        for (let i = 0; i < weekSelectedDays.length; i++) {
                                            if (weekSelectedDays[i]) {
                                                const selectedDay = (i == 6) ? 0 : i + 1;
                                                tx.executeSql("INSERT INTO GoalWeek(id_goal, day) VALUES (?, ?);", [goalId, selectedDay], () => {}, (t, error) => {
                                                    console.log(error);
                                                });
                                            }
                                        }
                                        break;
                                    case "custom":
                                        tx.executeSql("INSERT INTO GoalCustom(id_goal, first_date, num_days_between, num_available_before) VALUES (?, ?, ?, ?);", [goalId, selectedDate, customDaysBetween, daysBeforeDeadline], () => {}, (t, error) => {
                                            console.log(error);
                                        });
                                        break;
                                    default:
                                        break;
                                }
                            }, (t, error) => {
                                console.log(error);
                            });
                        });
                    } else {
                        // update goal
                        db.transaction((tx) => {
                            tx.executeSql("UPDATE Goals SET name = ?, id_group = ?, is_longterm = ?, date_started = ? WHERE id_goal = ?;", [name, selectedGroup, isLongterm, currentDate, route.params.goalData.id_goal], () => {
                                tx.executeSql("SELECT * FROM SmallerGoals WHERE id_goal = ?;", [route.params.goalData.id_goal], (_, { rows }) => {
                                    const smallerGoalsTemp = [];
                                    rows._array.forEach(smallerGoal => {
                                        smallerGoalsTemp.push(smallerGoal.name);
                                    });
                                    // Add new goals
                                    smallerGoals.filter(x => !smallerGoalsTemp.includes(x)).forEach(name => {
                                        tx.executeSql("INSERT INTO SmallerGoals(name, id_goal) VALUES (?, ?);", [name, route.params.goalData.id_goal], () => {}, (t, error) => {
                                            console.log(error);
                                        });
                                    });

                                    // Remove now deleted goals
                                    smallerGoalsTemp.filter(x => !smallerGoals.includes(x)).forEach(name => {
                                        tx.executeSql("DELETE FROM SmallerGoals WHERE name = ? AND id_goal = ?;", [name, route.params.goalData.id_goal], () => {}, (t, error) => {
                                            console.log(error);
                                        })
                                    })
                                }, (t, error) => {
                                    console.log(error);
                                });
                            }, (t, error) => {
                                console.log(error);
                            });

                            tx.executeSql("DELETE FROM GoalYear WHERE id_goal = ?;", [route.params.goalData.id_goal], () => {}, (t, error) => {
                                console.log(error);
                            });
                            tx.executeSql("DELETE FROM GoalMonth WHERE id_goal = ?;", [route.params.goalData.id_goal], () => {}, (t, error) => {
                                console.log(error);
                            });
                            tx.executeSql("DELETE FROM GoalWeek WHERE id_goal = ?;", [route.params.goalData.id_goal], () => {}, (t, error) => {
                                console.log(error);
                            });
                            tx.executeSql("DELETE FROM GoalCustom WHERE id_goal = ?;", [route.params.goalData.id_goal], () => {}, (t, error) => {
                                console.log(error);
                            });

                            // insert depending on frequency
                            switch (selectedFrequency) {
                                case "year":
                                    tx.executeSql("INSERT INTO GoalYear(id_goal, date, num_available_before) VALUES (?, ?, ?);", [route.params.goalData.id_goal, selectedDate, daysBeforeDeadline], () => {}, (t, error) => {
                                        console.log(error);
                                    });
                                    break;
                                case "month":
                                    tx.executeSql("INSERT INTO GoalMonth(id_goal, day, num_available_before) VALUES (?, ?, ?);", [route.params.goalData.id_goal, monthSelectedDay, daysBeforeDeadline], () => {}, (t, error) => {
                                        console.log(error);
                                    });
                                    break;
                                case "week":
                                    for (let i = 0; i < weekSelectedDays.length; i++) {
                                        if (weekSelectedDays[i]) {
                                            const selectedDay = (i == 6) ? 0 : i + 1;
                                            tx.executeSql("INSERT INTO GoalWeek(id_goal, day) VALUES (?, ?);", [route.params.goalData.id_goal, selectedDay], () => {}, (t, error) => {
                                                console.log(error);
                                            });
                                        }
                                    }
                                    break;
                                case "custom":
                                    tx.executeSql("INSERT INTO GoalCustom(id_goal, first_date, num_days_between, num_available_before) VALUES (?, ?, ?, ?);", [route.params.goalData.id_goal, selectedDate, customDaysBetween, daysBeforeDeadline], () => {}, (t, error) => {
                                        console.log(error);
                                    });
                                    break;
                                default:
                                    break;
                            }
                        });
                    }
                    storeDispatch({ type: "TOGGLE_FORCE_UPDATE" });
                    navigation.pop();
                }}
            >
                <Text>{(route.params.goalData) ? "Update goal" : "Add goal"}</Text>
            </Pressable>
        </>
    );
};

const SmallerGoal = ({ id, name, smallerGoals, setSmallerGoals }) => {
    return (
        <View style={[ flexStyles.alignedRow, formStyles.formSmallerRow, formStyles.formSmallerGoal]} id={ id }>
            <Text>{ name }</Text>
            <Pressable
                style={[formStyles.button, formStyles.buttomMarginRound]}
                onPress={() => {
                    setSmallerGoals(smallerGoals.filter(item => item !== name));
                }}
                android_ripple={{
                    color: "white",
                    borderless: true,
                }}
            >
                <Text>
                    Remove
                </Text>
            </Pressable>
        </View>
    );
}

export default AddGoal;