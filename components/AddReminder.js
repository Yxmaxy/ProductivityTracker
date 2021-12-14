import React, { useState } from 'react';
import { StyleSheet, KeyboardAvoidingView, Text, TextInput, Pressable, View, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const AddReminder = () => {
    const [name, onChangeName] = useState("");
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [time, setTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);

    const onDateChange = (event, selectedDate) => {
        console.log(selectedDate);
        if (selectedDate != null)
            setDate(selectedDate);
        setShowDatePicker(false);
    };

    const onTimeChange = (event, selectedTime) => {
        if (selectedTime != null) {
            console.log(selectedTime.getTime());
            setTime(selectedTime.getTime());
        }
        setShowTimePicker(false);
    };
    

    return(
        <KeyboardAvoidingView style={styles.container}>
            <Text>Name</Text>
            <TextInput
                onChangeText={ onChangeName }
                value={name}
                style= {styles.textInput}
            />
            <View style={styles.inputRow}>
                <Text>Select notification date</Text>
                <Button title={date.toDateString()} onPress={() => setShowDatePicker(true)}></Button>
            </View>
            <View style={styles.inputRow}>
                <Text>Select notification time</Text>
                <Button title={time.getHours() + ":" + time.getMinutes()} onPress={() => setShowTimePicker(true)}></Button>
            </View>
            <Pressable 
                style={styles.submitButton}
                onPress={() => {
                    console.log("oi")
                }}
            ><Text>Add reminder</Text></Pressable>
            {showDatePicker && <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onDateChange}
            />}
            
            {showTimePicker && <DateTimePicker
                value={time}
                mode="time"
                display="default"
                is24Hour={true}
                onChange={onTimeChange}
            />}

        </KeyboardAvoidingView>
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
    }
});

export default AddReminder;