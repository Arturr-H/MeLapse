import { Dimensions, StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",

        display: "flex",
        justifyContent: "center",
        flexDirection: "column",

        width: "100%",
        height: "100%",
    },

    reviewImage: {
        width: "100%",
        height: "100%",
    },

    bottom: {
        width: "100%",
        // height: 100,
        bottom: 0,

        display: "flex",
        flexDirection: "column",
        gap: 10,

        padding: 10,
        paddingBottom: 50,

        backgroundColor: "#fff",
        borderRadius: 30,

        borderColor: "rgb(235, 235, 235)",
        borderWidth: 2,
    },
    row: {
        width: "100%",
        // height: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
    },

    timewarpButton: {
        flex: 1,
        height: 80,

        borderRadius: 20,
        backgroundColor: "rgb(90, 200, 245)",
        borderColor: "rgb(80, 190, 245)",
        borderWidth: 2,

        display: "flex",
        justifyContent: "center",
            alignItems: "center",    
    },
    timewarpButtonText: {
        fontSize: 30
    },
    safeAreaView: {
        width: "100%",
        height: "100%",
        position: "absolute",

        zIndex: 2,

        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
            alignItems: "center",
    },

    deleteButtonContainer: {
        width: "100%",
        paddingHorizontal: 40,
        marginTop: 50
    }
})