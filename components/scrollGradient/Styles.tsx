import { Dimensions, StyleSheet } from "react-native";

export default StyleSheet.create({
    gradientContainer: {
        width: "100%",
        height: "100%",

        position: "absolute",
        zIndex: 2,

        display: "flex",
        justifyContent: "space-between",
            alignItems: "center",

        flexDirection: "column",
            alignSelf: "center"
    },
    gradient: {
        width: "100%",
        height: 75
    },
    flip: {
        transform: [{ rotate: "180deg" }]
    }
})