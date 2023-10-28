import { Dimensions, StyleSheet } from "react-native";

/* Constants */
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

export default StyleSheet.create({
    button: {
        height: 50,
        minHeight: 50,

        borderWidth: 2,
        borderRadius: 15,
        overflow: "hidden",

        display: "flex",
        justifyContent: "center",
            alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 20,
        fontFamily: "manrope-black",

        textTransform: "uppercase",
    },

    emoji: {
        position: "absolute",
        left: 0,
        fontSize: 30,

        transform: [{ translateX: 6 }],
        opacity: 0.4
    }
})