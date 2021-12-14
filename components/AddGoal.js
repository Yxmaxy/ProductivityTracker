import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, Pressable, KeyboardAvoidingView } from 'react-native';
import * as SQLite from "expo-sqlite";
import { Picker } from '@react-native-picker/picker';

const db = SQLite.openDatabase("db.db");

const AddGoal = ({ navigation }) => {
    const [name, setName] = useState("");
    const [selectedGroup, setSelectedGroup] = useState("");
    const [selectedFrequency, setSelectedFrequency] = useState("week");
    const [daysBeforeDeadline, setDaysBeforeDeadline] = useState(0);

    return (
        <KeyboardAvoidingView style={ styles.container }>
            <Text>Name</Text>
            <TextInput
                style= {styles.textInput}
                value={name}
                onChangeText={ setName }
            />
            <Text>Group</Text>
            <Picker
                selectedValue={selectedGroup}
                onValueChange={(itemValue, itemIndex) => {
                    setSelectedGroup(itemValue);
                }}>
                <Picker.Item label="Java" value="java" />
                <Picker.Item label="JavaScript" value="js" />
            </Picker>
            <Text>Frequency</Text>
            <Picker
                selectedValue={selectedFrequency}
                onValueChange={(itemValue, itemIndex) => {
                    setSelectedFrequency(itemValue);
                }}>
                <Picker.Item label="Weekly" value="week" />
                <Picker.Item label="Monthly" value="month" />
                <Picker.Item label="Yearly" value="year" />
                <Picker.Item label="Custom" value="custom" />
            </Picker>
            <Text>Days available before deadline</Text>
            <TextInput 
                style= {styles.textInput}
                value={ daysBeforeDeadline.toString() }
                onChangeText={ setDaysBeforeDeadline }
                keyboardType="numeric"
            />
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
    }
});

export default AddGoal;