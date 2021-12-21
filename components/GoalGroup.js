import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

const GoalGroup = ({ title, children }) => {
    const [showChildren, setShowChildren] = useState(true);
    return (
        <>
            <TouchableOpacity style={styles.container} onPress={() => {
                setShowChildren(!showChildren);
            }}>
                <Text>{ title }</Text>
                <Text>
                    {showChildren && "🔽"}
                    {!showChildren && "◀"}
                </Text>
            </TouchableOpacity>
            { showChildren && children }
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        justifyContent: "space-between",
        display: "flex",
        flexDirection: "row",
    }
});

export default GoalGroup;