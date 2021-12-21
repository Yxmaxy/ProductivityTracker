import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { smallerGoalStyles } from "./common/styles";

const SmallerGoal = ({ title }) => {
    return (
        <TouchableOpacity 
            style={ smallerGoalStyles.container }
            activeOpacity={ 0.8 }
        >
            <Text>{ title }</Text>
            <Text>Yes</Text>
        </TouchableOpacity>
    );
}

export default SmallerGoal;