import { Dimensions, StyleSheet } from "react-native";

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

        paddingHorizontal: 30,
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
        fontFamily: "inter-extrabold",
        fontSize: 42,

        marginBottom: 10
    },
    header2: {
        fontFamily: "inter-bold",
        fontSize: 22,
        marginBottom: 5,
    },
    paragraph: {
        fontSize: 16,
        color: "#d0d0d0",
        marginBottom: 5,
        fontWeight: "300",

        paddingHorizontal: 5
    },

    paragraphWhite: {
        fontSize: 16,
        color: "#fff",
        fontWeight: "800",

        paddingHorizontal: 10,
        textAlign: "center"
    },
    italic: {
        fontStyle: "italic",
        color: "#5c5c5c",
        fontWeight: "200"
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
    }
})