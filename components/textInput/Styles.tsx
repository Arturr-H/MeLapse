import { Dimensions, StyleSheet } from "react-native";

/* Constants */
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

export default StyleSheet.create({
    textInputWrapper: {
        width: "100%",
        height: 50,
        
        backgroundColor: "#fff",
        borderColor: "#eee",
        borderWidth: 2,
        borderRadius: 15,

        paddingHorizontal: 20,

        display: "flex",
        flexDirection: "row"
    },
    textInput: {
        flex: 2,
        height: "100%",
        fontFamily: "manrope-light"
    },
    focused: {
        borderColor: "rgb(90, 200, 245)",
        backgroundColor: "#f6f6f6"
    },

    charLenTextWrapper: {
        height: "100%",
        width: 50,
        // backgroundColor: "red",

        display: "flex",
        justifyContent: "center",
            alignItems: "center"
    },
    charLenText: {
        color: "rgb(255, 69, 58)",
        textAlign: "right",
    }
})