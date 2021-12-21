import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { floatingButtonStyles } from "./common/styles";

const FloatingButton = ({ text, navigation, navigateTo, isLongterm }) => {
    return(
        <TouchableOpacity style={ floatingButtonStyles.button }
            onPress={() => {
                navigation.navigate(navigateTo, { isLongterm });
            }}
        >
            <Text>{ text }</Text>
        </TouchableOpacity>
    );
}

export default FloatingButton;