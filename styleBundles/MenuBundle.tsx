import { Dimensions, StyleSheet } from "react-native";
import { Colors } from "./Colors";
const WIDTH = Dimensions.get("window").width;

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",

        width: "100%",
        height: "100%",
    },
    keyboardAvoidingView: {
        height: "100%",
        width: "100%",
    },
    containerInner: {
        justifyContent: "center",
        
        display: "flex",
        flexDirection: "column",
        gap: 15,
        width: "100%",

        paddingTop: 20 + 25,

        /// Check row style object transform comment
        paddingBottom: 20 + 10 + 50,
    },

    header: {
        fontFamily: "manrope-black",
        fontSize: 42,

        marginBottom: 10,
    },
    header2: {
        fontFamily: "manrope-black",
        fontSize: 22,
        marginBottom: 5,
    },
    paragraph: {
        fontSize: 16,
        color: Colors.text.light, //"#d0d0d0",
        marginBottom: 5,
        fontFamily: "manrope-light",

        paddingHorizontal: 5
    },

    paragraphWhite: {
        fontSize: 16,
        color: "#fff",

        paddingHorizontal: 10,
        textAlign: "center",
        fontFamily: "manrope-black",
    },
    italic: {
        fontStyle: "italic",
        color: Colors.text.light,
    },

    row: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        gap: 20,
    },
    tile: {
        flex: 1,
    },

    hr: {
        width: "100%",
        height: 2,
        backgroundColor: "#00000010",
        borderRadius: 1,

        marginTop: 15,
        marginBottom: 10
    },

    padded: {
        paddingHorizontal: 30,
    },
    hrPadded: {
        width: WIDTH - 30*2,
        left: 30
    },
})