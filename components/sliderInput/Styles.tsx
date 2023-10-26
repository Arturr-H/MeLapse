import { Dimensions, StyleSheet } from "react-native";
import { Colors } from "../../styleBundles/Colors";

/* Constants */
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

export default StyleSheet.create({
    inputWrapper: {
        display: "flex",
        flexDirection: "row",
    },
    sliderInput: {
        width: "100%",
        height: 30,
        
        backgroundColor: "#eee",
        borderColor: "#eee",
        borderWidth: 2,
        borderRadius: 15,

        padding: 5,
        flex: 6
    },
    sliderInputFillWrapper: {
        width: "100%",
        height: "100%",
        overflow: "hidden",
        borderRadius: 10
    },
    sliderInputFill: {
        backgroundColor: Colors.blue.default,
        width: "100%",
        height: "100%",

        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",

        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
    },
    sliderInputIndicator: {
        height: "100%",
        aspectRatio: 1,
        borderWidth: 2,
        transform: [{ translateX: 10 }],

        borderColor: Colors.blue.darkened,
        backgroundColor: Colors.blue.default,

        borderRadius: 10,
    },

    valueContainer: {
        flex: 1,

        display: "flex",
        justifyContent: "center",
            alignItems: "center",
    },
    valueText: {
        fontFamily: "manrope-black",
        color: "#ddd"
    }
})