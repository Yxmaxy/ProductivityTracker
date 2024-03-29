import React, { useContext, useState } from 'react';
import { View, TouchableOpacity, Platform, Text, TextInput, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Context } from '../../common/Store';
import { flexStyles, formStyles } from '../../common/styles';
import { db } from '../../common/globals';

const AddReminder = ({ navigation }) => {
    const [name, onChangeName] = useState("");
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const [, storeDispatch] = useContext(Context);

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
        <>
            <View style={[flexStyles.container, flexStyles.containerMargin]}>
                <View style={formStyles.formRow}>
                    <Text>Name</Text>
                    <TextInput
                        onChangeText={ onChangeName }
                        value={name}
                        style= {formStyles.textInput}
                    />
                </View>
                <View style={formStyles.formRow}>
                <Text>Notification time</Text>
                    <TouchableOpacity onPress={showDatepicker}>
                        <Text>{formatDate(date, time)}</Text>
                    </TouchableOpacity>
                </View>
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
            </View>
            <Pressable 
            style={formStyles.submitButton}
            onPress={() => {
                const selectedDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + (time.getHours() - 2) + ":" + time.getMinutes();
                db.transaction((tx) => {
                    tx.executeSql("INSERT INTO Reminders(name, notify_when) VALUES (?, ?);", [name, selectedDate], () => {}, (t, error) => {
                        console.log(error);
                    });
                });
                storeDispatch({ type: "TOGGLE_FORCE_UPDATE" });
                navigation.pop();
            }}
        >
            <Text>Add reminder</Text>
        </Pressable>
    </>
    );
};

export default AddReminder;