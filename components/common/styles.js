import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

//* Common
export const colors = {
    colorPopRed: "#F06449",
    colorPopBlue: "#5BC3EB",
    colorPopDarkBlue: "#456990",
    colorBaseLight: "#EDE6E3",
    colorBaseDark: "#DADAD9",
    colorText: "#36382E",
}

export const flexStyles = StyleSheet.create({
    container: {
        flex: 1
    },
    alignedRow: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    containerMargin: {
        margin: 10,
        marginBottom: 30,
    }
});

export const formStyles = StyleSheet.create({
    formRow: {
        marginBottom: 17,
    },
    formSmallerRow: {
        marginBottom: 7,
    },
    formSmallerGoal: {
        backgroundColor: colors.colorBaseLight,
        alignItems: "center",
        paddingLeft: 10,
        borderRadius: 4,
    },
    textInput: {
        backgroundColor: "white",
        borderColor: colors.colorPopDarkBlue,
        borderWidth: 2,
        paddingLeft: 3,
        paddingRight: 3,
        borderRadius: 4,
    },
    button: {
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        backgroundColor: colors.colorPopBlue,
    },
    buttomMarginRound: {
        marginLeft: 3,
        borderRadius: 4,
    },
    submitButton: {
        backgroundColor: colors.colorPopBlue,
        alignItems: "center",
        position: "absolute",
        width: "100%",
        bottom: 0,
        padding: 10,
    },
});

//* Screens
// TabNav
export const tabNavScreenStyles = StyleSheet.create({
    dateContainer: {
        backgroundColor: "white",
        textAlign: "right",
        padding: 17,
    },
    dateText: {
        fontWeight: "bold",
        fontSize: 18,
    },
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
    },
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
        backgroundColor: colors.colorPopDarkBlue,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: 20,
        color: colors.colorBaseDark,
    },
    containerWithMargin: {
        marginBottom: 80,
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
        backgroundColor: colors.colorBaseLight
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
        backgroundColor: colors.colorBaseDark,
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