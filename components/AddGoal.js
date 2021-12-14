import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, Pressable, KeyboardAvoidingView, Button, View } from 'react-native';
import * as SQLite from "expo-sqlite";
import { Picker } from '@react-native-picker/picker';

const db = SQLite.openDatabase("db.db");

const AddGoal = ({ navigation }) => {
    const [name, setName] = useState("");
    const [selectedGroup, setSelectedGroup] = useState("");
    const [selectedFrequency, setSelectedFrequency] = useState("week");
    const [daysBeforeDeadline, setDaysBeforeDeadline] = useState(0);
    const [goalGroups, setGoalGroups] = useState([]);
    const [forceUpdate, setForceUpdate] = useState(false);

    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql("SELECT * FROM GoalGroups;", [], (_, { rows }) => {
                setGoalGroups(rows._array);
            }, (t, error) => {
                console.log(error);
            });
        });
    }, [forceUpdate])

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
                        navigation.navigate("AddGroup", {
                            onGoBack: () => setForceUpdate(!forceUpdate)
                        });
                    }}
                />
            </View>
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
            <Text>Is longterm?</Text>
            <Text>Smaller goals</Text>
            <Text>Time</Text>
            <TextInput
                style= {styles.textInput}
                value={name}
                onChangeText={ setName }
            />
            
            <Pressable 
                style={styles.submitButton}
                onPress={() => {
                    db.transaction((tx) => {
                        /*tx.executeSql("INSERT INTO Reminders(name, notify_when) VALUES (?, ?);", [name, selectedDate], () => {}, (t, error) => {
                            console.log(error);
                        });*/
                    });
                }}
            >
                <Text>Add goal</Text>
            </Pressable>
        </KeyboardAvoidingView>
    );
};

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