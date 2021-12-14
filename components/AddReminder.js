import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Platform, Text, TextInput, Pressable, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("db.db");

const AddReminder = ({ navigation }) => {
    const [name, onChangeName] = useState("");
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const onChange = (event, selectedValue) => {
        setShow(Platform.OS === 'ios');
        if (mode == 'date') {
            const currentDate = selectedValue || new Date();
            setDate(currentDate);
            setMode('time');
            setShow(Platform.OS !== 'ios'); // to show the picker again in time mode
        } else {
            const selectedTime = selectedValue || new Date();
            setTime(selectedTime);
            setShow(Platform.OS === 'ios');
            setMode('date');
        }
    };

    const showMode = currentMode => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const formatDate = (date, time) => {
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${time.getHours() - 2}:${time.getMinutes()}`;
    };

    return (
        <View style={ styles.container }>
            <Text>Name</Text>
            <TextInput
                onChangeText={ onChangeName }
                value={name}
                style= {styles.textInput}
            />
            <Text>Notification time</Text>
            <TouchableOpacity onPress={showDatepicker}>
                <Text>{formatDate(date, time)}</Text>
            </TouchableOpacity>
            {show && (
                <DateTimePicker
                testID="dateTimePicker"
                timeZoneOffsetInMinutes={0}
                value={date}
                mode={mode}
                is24Hour={true}
                display="default"
                onChange={onChange}
                />
            )}
            <Pressable 
                style={styles.submitButton}
                onPress={() => {
                    const selectedDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + (time.getHours() - 2) + ":" + time.getMinutes();
                    db.transaction((tx) => {
                        tx.executeSql("INSERT INTO Reminders(name, notify_when) VALUES (?, ?);", [name, selectedDate], () => {}, (t, error) => {
                            console.log(error);
                        });
                    });
                    navigation.pop();
                }}
            >
                <Text>Add reminder</Text>
            </Pressable>
        </View>
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

export default AddReminder;