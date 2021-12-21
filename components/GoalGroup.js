import React, { useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import { goalGroupStyles } from "./common/styles";

const GoalGroup = ({ title, children }) => {
    const [showChildren, setShowChildren] = useState(true);
    return (
        <>
            <TouchableOpacity style={goalGroupStyles.container} onPress={() => {
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

export default GoalGroup;