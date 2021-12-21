import React, { useContext, useState } from 'react';
import { Text, TextInput, Pressable, KeyboardAvoidingView, View } from 'react-native';
import * as SQLite from "expo-sqlite";
import ColorPicker from 'react-native-wheel-color-picker';
import { Context } from '../../common/Store';
import Goal from '../../Goal';
import { flexContainer, formStyles } from '../../common/styles';

const db = SQLite.openDatabase("db.db");

const AddGroup = ({ navigation }) => {
    const [name, setName] = useState("");
    const [selectedColor, setSelectedColor] = useState("#00afef");

    const [, storeDispatch] = useContext(Context);

    return (
        <KeyboardAvoidingView style={ flexContainer.container }>
            <Text>Name</Text>
            <TextInput
                style= {formStyles.textInput}
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
            <Text style={{ color: "black", marginTop: 20 }}>
                Goal preview:
            </Text>
            <Goal title="Goal" color={selectedColor} />

            <Pressable 
                style={formStyles.submitButton}
                onPress={() => {
                    db.transaction((tx) => {
                        tx.executeSql("INSERT INTO GoalGroups(name, color) VALUES (?, ?);", [name, selectedColor], () => {}, (t, error) => {
                            console.log(error);
                        });
                    });
                    storeDispatch({ type: "TOGGLE_FORCE_UPDATE" });
                    navigation.pop();
                }}
            >
                <Text>Add group</Text>
            </Pressable>
        </KeyboardAvoidingView>
    );
};

export default AddGroup;