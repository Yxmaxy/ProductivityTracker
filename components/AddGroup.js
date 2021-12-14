import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, Pressable, KeyboardAvoidingView, View } from 'react-native';
import * as SQLite from "expo-sqlite";
import ColorPicker from 'react-native-wheel-color-picker';

const db = SQLite.openDatabase("db.db");

const AddGroup = ({ route, navigation }) => {
    const [name, setName] = useState("");
    const [selectedColor, setSelectedColor] = useState("#db643a");

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
                        tx.executeSql("INSERT INTO GoalGroups(name, color) VALUES (?, ?);", [name, selectedColor], () => {}, (t, error) => {
                            console.log(error);
                        });
                    });
                    route.params.onGoBack();
                    navigation.goBack();
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