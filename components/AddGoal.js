import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, Pressable, KeyboardAvoidingView, Button, View } from 'react-native';
import * as SQLite from "expo-sqlite";
import { Picker } from '@react-native-picker/picker';
import Checkbox from 'expo-checkbox';
import { Context } from './Store';

const db = SQLite.openDatabase("db.db");

const AddGoal = ({ route, navigation }) => {
    const [name, setName] = useState("");
    const [smallerGoalName, setSmallerGoalName] = useState("");
    const [smallerGoals, setSmallerGoals] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(1);
    const [selectedFrequency, setSelectedFrequency] = useState("week");
    const [daysBeforeDeadline, setDaysBeforeDeadline] = useState(0);
    const [goalGroups, setGoalGroups] = useState([]);
    const [isLongterm, setIsLongterm] = useState(route.params.isLongterm);

    const [storeState, storeDispatch] = useContext(Context);

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
        <KeyboardAvoidingView style={ styles.container }>
            <Text>Name</Text>
            <TextInput
                style= {styles.textInput}
                value={name}
                onChangeText={ setName }
            />
            <Text>Group</Text>
            <View style={ styles.alignedRow }>
                <Picker
                    style={{
                        flex: 1,
                    }}
                    selectedValue={selectedGroup}
                    onValueChange={(itemValue, itemIndex) => {
                        setSelectedGroup(itemValue);
                }}>
                    {goalGroups.map(group => {
                        return (
                            <Picker.Item id={ group.id_group } label={ group.name } value={ group.id_group } style={{
                                color: group.color,
                            }}/>
                        );
                    })}
                </Picker>
                <Button title="+" 
                    onPress={() => {
                        navigation.navigate("AddGroup");
                    }}
                />
            </View>
            <Text>Is longterm?</Text>
            <Checkbox 
                value={isLongterm}
                onValueChange={setIsLongterm}
            />
            { !isLongterm && <View>
                <Text>Frequency</Text>
                <Picker
                    selectedValue={selectedFrequency}
                    onValueChange={(itemValue, itemIndex) => {
                        setSelectedFrequency(itemValue);
                    }}>
                    <Picker.Item id={1} label="Weekly" value="week" />
                    <Picker.Item id={2} label="Monthly" value="month" />
                    <Picker.Item id={3} label="Yearly" value="year" />
                    <Picker.Item id={4} label="Custom" value="custom" />
                </Picker>
                <Text>Days available before deadline</Text>
                <View style={ styles.alignedRow }>
                    <TextInput 
                        style={[ styles.textInput, { flex: 1 } ]}
                        value={ daysBeforeDeadline.toString() }
                        onChangeText={ setDaysBeforeDeadline }
                        keyboardType="numeric"
                    />
                    <Button title="+" onPress={() => {
                        setDaysBeforeDeadline(daysBeforeDeadline + 1);
                    }}/>
                    <Button title="-" onPress={() => {
                        if (daysBeforeDeadline > 0)
                            setDaysBeforeDeadline(daysBeforeDeadline - 1);
                    }}/>
                </View>
            </View>}

            <Text>Smaller goals</Text>
            <View style={ styles.alignedRow }>
                <TextInput
                    style= {[ styles.textInput , {flex: 1}]}
                    value={ smallerGoalName }
                    onChangeText={ setSmallerGoalName }
                    placeholder="Enter name of smaller goal"
                />
                <Button title="Add" onPress={() => {
                    setSmallerGoals([...smallerGoals, smallerGoalName]);
                    setSmallerGoalName("");
                }}/>
            </View>
            {smallerGoals.map((smallerGoal, index) => {
                return <SmallerGoal id={index} name={smallerGoal} smallerGoals={smallerGoals} setSmallerGoals={setSmallerGoals}/>;
            })}

            <Pressable 
                style={styles.submitButton}
                onPress={() => {
                    if (isLongterm) {
                        // insert goals
                        var insertedId;
                        db.transaction((tx) => {
                            tx.executeSql("INSERT INTO Goals(name, id_group, is_longterm) VALUES (?, ?, ?);", [name, selectedGroup, true], (txObj, resultSet) => {
                                insertedId = resultSet.insertId;
                            }, (t, error) => {
                                console.log(error);
                            });
                        });
                        // insert smaller goals
                        db.transaction((tx) => {
                            smallerGoals.forEach(smallerGoalName => {
                                tx.executeSql("INSERT INTO SmallerGoals(name, id_goal) VALUES (?, ?);", [smallerGoalName, insertedId], () => {}, (t, error) => {
                                    console.log(error);
                                });
                            });
                            
                        });
                    }
                    storeDispatch({ type: "TOGGLE_FORCE_UPDATE" });
                    navigation.pop();
                }}
            >
                <Text>Add goal</Text>
            </Pressable>
        </KeyboardAvoidingView>
    );
};

const SmallerGoal = ({ id, name, smallerGoals, setSmallerGoals }) => {
    return (
        <View style={ styles.inputRow } id={ id }>
            <Text>{ name }</Text>
            <Button title="Remove" onPress={() => {
                setSmallerGoals(smallerGoals.filter(item => item !== name));
            }}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    textInput: {
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "black",
    },
    submitButton: {
        backgroundColor: "dodgerblue",
        position: "absolute",
        bottom: 0,
        width: "100%",
        alignItems: "center",
        padding: 10,
    },
    inputRow: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    alignedRow: {
        display: "flex",
        flexDirection: "row",
    }
});

export default AddGoal;