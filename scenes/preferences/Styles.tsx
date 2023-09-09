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
        color: "#d0d0d0",
        marginBottom: 5,
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

        width: "100%",
        height: "100%",
    },
    keyboardAvoidingView: {
        height: "100%",
        width: "100%",

        paddingHorizontal: 30,
    },
    containerInner: {
        justifyContent: "center",
        
        display: "flex",
        flexDirection: "column",
        gap: 15,
        width: "100%",

        paddingTop: 20,

        /// Check row style object transform comment
        paddingBottom: 20 + 10
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

    row: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 15,

        backgroundColor: "#fff",
        borderColor: "#eee",
        borderWidth: 2,
        borderRadius: 20,
        padding: 5,

        /// So the white corners won't be visible
        /// through the borderradius bevels
        transform: [{ translateY: -20 }],
        zIndex: 10
    },
})