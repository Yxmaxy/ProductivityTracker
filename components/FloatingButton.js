import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

const FloatingButton = ({ text, navigation, navigateTo, isLongterm }) => {
    return(
        <TouchableOpacity style={ styles.button }
            onPress={() => {
                navigation.navigate(navigateTo, { isLongterm });
            }}
        >
            <Text>{ text }</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        width: 60,
        height: 60,
        borderRadius: 100,
        backgroundColor: "chocolate",
        position: "absolute",
        bottom: 10,
        right: 10,
        justifyContent: "center",
        alignItems: "center",
    }
});

export default FloatingButton;