import { Dimensions, StyleSheet } from "react-native";

/* Constants */
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

export default StyleSheet.create({
    selectInput: {
        width: "100%",
        height: 50,
        
        backgroundColor: "#eee",
        borderColor: "#eee",
        borderWidth: 2,
        borderRadius: 15,

        padding: 2,
    },
    selectButtonWrapper: {
        width: "100%",
        height: "100%",

        flex: 1,
        display: "flex",
        flexDirection: "row",
        gap: 5
    },
    selectButton: {
        display: "flex",
        justifyContent: "center",
            alignItems: "center",

        borderRadius: 10,

        width: "100%",
        height: "100%",

    },
    selectButtonActive: {
        backgroundColor: "rgb(90, 200, 245)",
        borderColor: "rgb(80, 190, 245)",
        borderWidth: 2,
    },
    buttonText: {
        color: "#000",
        fontSize: 20,
        fontFamily: "manrope-black",
    },
    buttonTextActive: {
        color: "#fff",
        fontSize: 20,
        fontFamily: "manrope-black",
    },

    textMainLowerContainer: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
            alignItems: "center"
    },
    buttonTextDescription: {
        color: "#aaa",
        fontSize: 11,
        marginTop: -5,
        fontFamily: "manrope-light",
    },
    buttonTextDescriptionActive: {
        color: "#fff",
        fontSize: 11,
        marginTop: -5,
        fontFamily: "manrope-light",
    },
})