import React, { useState } from "react";
import { StyleSheet, Text } from "react-native";

const GoalGroup = ({ title, children }) => {
    const [showChildren, setShowChildren] = useState(true);
    return (
        <>
            <Text onPress={() => {
                setShowChildren(!showChildren);
            }}>{ title }</Text>
            { showChildren && children }
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export default GoalGroup;