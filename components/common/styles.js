import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

//* Common
export const colors = {
    colorPop1: "#F06449",
    colorPop2: "#5BC3EB",
    colorPop3: "#456990",
    colorBase1: "#EDE6E3",
    colorBase2: "#DADAD9",
    colorText: "#36382E",
}

export const flexContainer = StyleSheet.create({
    container: {
        flex: 1
    }
});

export const formStyles = StyleSheet.create({
    textInput: {
        backgroundColor: "white",
        borderColor: "black",
        borderWidth: 1,
    },
    submitButton: {
        backgroundColor: "dodgerblue",
        alignItems: "center",
        position: "absolute",
        width: "100%",
        bottom: 0,
        padding: 10,
        
    },
    alignedRow: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    },
});

//* Screens
// TabNav
export const tabNavScreenStyles = StyleSheet.create({
    dateText: {
        backgroundColor: "white",
        textAlign: "right",
        fontWeight: "bold",
        padding: 17,
        fontSize: 18,
    },
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
    },
});

// AddGoal
export const addGoalStyles = StyleSheet.create({
    weekContainer: {
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
        justifyContent: "space-between",
    }
});

//* Components
// Floating button
export const floatingButtonStyles = StyleSheet.create({
    button: {
        borderRadius: 100,
        width: 60,
        height: 60,
        position: "absolute",
        bottom: 10,
        right: 10,
        backgroundColor: "chocolate",
        justifyContent: "center",
        alignItems: "center",
    }
});

// Goal
export const goalStyles = StyleSheet.create({
    goal: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        margin: 2,
        marginTop: 0,
        borderLeftWidth: 12,
        backgroundColor: "#ebebeb",
    },
});

// GoalGroup
export const goalGroupStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        justifyContent: "space-between",
        display: "flex",
        flexDirection: "row",
    }
});

// SmallerGoal
export const smallerGoalStyles = StyleSheet.create({
    container: {
        backgroundColor: "blue",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        margin: 2,
        marginTop: 0,
    },
});