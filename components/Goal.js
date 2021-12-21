import React from "react";
import {StyleSheet, TouchableOpacity, Text } from "react-native";


const Goal = ({ title, color }) => {
    return (
        <TouchableOpacity 
            style={[styles.container, {
                borderLeftColor: color,
            }]}
            activeOpacity={ 0.8 }
        >
            <Text style={{ color: "black"}}>{ title }</Text>
            <Text>Yes</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderLeftWidth: 12,
        backgroundColor: "#ebebeb",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        margin: 2,
        marginTop: 0,
    },
});

export default Goal;