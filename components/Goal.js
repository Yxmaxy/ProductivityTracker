import React from "react";
import {StyleSheet, TouchableOpacity, Text } from "react-native";


const Goal = () => {
    return (
        <TouchableOpacity 
            style={ styles.container }
            activeOpacity={ 0.8 }
        >
            <Text>Hello</Text>
            <Text>Yes</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "red",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        margin: 2,
        marginTop: 0,
    },
});

export default Goal;