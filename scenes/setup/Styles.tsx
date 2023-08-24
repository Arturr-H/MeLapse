import { Dimensions, StyleSheet } from "react-native";

/* Constants */
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

export default StyleSheet.create({
    header: {
        fontFamily: "inter-extrabold",
        fontSize: 42,
    },
    paragraph: {
        fontSize: 16,
        color: "#9c9c9c",
        marginBottom: 10,
        fontWeight: "300",
    },
    italic: {
        fontStyle: "italic",
        color: "#5c5c5c",
        fontWeight: "200"
    },


    container: {
        flex: 1,
        backgroundColor: "#fff",

        display: "flex",
        justifyContent: "center",
        flexDirection: "column",

        width: "100%",
        height: "100%",

        paddingHorizontal: 40
    },
    containerInner: {
        justifyContent: "center",
        
        display: "flex",
        flexDirection: "column",
        gap: 10,

        height: "50%",
    },

    frequencyInput: {
        width: "100%",
        height: 50,
        
        backgroundColor: "#eee",
        borderColor: "#eee",
        borderWidth: 2,
        borderRadius: 15,

        padding: 2,
    },
    freqButtonWrapper: {
        width: "100%",
        height: "100%",

        flex: 1,
        display: "flex",
        flexDirection: "row",
        gap: 5
    },
    freqButton: {
        display: "flex",
        justifyContent: "center",
            alignItems: "center",

        borderRadius: 10,

        width: "100%",
        height: "100%",
    },
    freqButtonActive: {
        backgroundColor: "rgb(90, 200, 245)",
        borderColor: "rgb(80, 190, 245)",
        borderWidth: 2,
    },
    buttonText: {
        color: "#000",
        fontSize: 20,
        fontFamily: "inter-black",
    },
    buttonTextActive: {
        color: "#fff",
        fontSize: 20,
        fontFamily: "inter-black",
    },
})