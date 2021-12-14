import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, Pressable, KeyboardAvoidingView, View } from 'react-native';
import * as SQLite from "expo-sqlite";
import ColorPicker from 'react-native-wheel-color-picker';

const db = SQLite.openDatabase("db.db");

const AddGroup = ({ navigation }) => {
    const [name, setName] = useState("");
    const [selectedColor, setSelectedColor] = useState("#db643a");

    const COLORS = [
        '#d73964',
        '#d23440',
        '#db643a',
        '#e88334',
        '#e2a71e',
        '#e25241',
        '#d0da59',
        '#4053ae',
        '#70b949',
        '#73564a',
        '#67ab5a',
        '#8f36aa',
        '#f6c244',
        '#52b9d0',
        '#4595ec',
        '#009688',
        '#5abeA7',
        '#59bccd',
        '#4a97e4',
        '#2d68cd',
        '#9946c7',
        '#d9639e',
        '#6d6f74',
        '#939287',
        '#868ea3',
    ];

    return (
        <KeyboardAvoidingView style={ styles.container }>
            <Text>Name</Text>
            <TextInput
                style= {styles.textInput}
                value={name}
                onChangeText={ setName }
            />
            <ColorPicker
                style={{
                    flex: 0.6,
                }}
                color={selectedColor}
                onColorChange={setSelectedColor}
                thumbSize={27}
                noSnap={true}
                swatches={true}
                discrete={true}
            />
            <Text
                style={{
                    color: selectedColor,
                    fontSize: 22,
                    fontWeight: '500',
                    marginTop: 20,
                }}>
                    Selected color: {selectedColor}
                </Text>

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
                <Text>Add group</Text>
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

export default AddGroup;