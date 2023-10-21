import { Dimensions, StyleSheet } from "react-native";
import MenuBundle from "../../styleBundles/MenuBundle";
import { Colors } from "../../styleBundles/Colors";

export default StyleSheet.create({
    ...MenuBundle,

    container: {
        flex: 1,
        backgroundColor: "#fff",

        display: "flex",
        justifyContent: "center",
        flexDirection: "column",

        width: "100%",
        height: "100%",
    },
    headerView: {
        width: "100%",
        flex: 2,

        display: "flex",
        justifyContent: "center",
            alignItems: "center"
    },
    body: {
        width: "100%",
        flex: 9,

        display: "flex",
        justifyContent: "center",
            alignItems: "center"
    },
    footer: {
        width: "100%",
        flex: 2,

        flexDirection: "row",
        justifyContent: "center",
            alignItems: "center",

        paddingHorizontal: 20,
        gap: 15
    },

    reviewImageContainer: {
        width: "100%",
        height: "100%",

        display: "flex",
        justifyContent: "center",
            alignItems: "center",
    },
    reviewImage: {
        height: "100%",
        width: "75%",
        objectFit: "contain",
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

        borderRadius: 15,
        backgroundColor: Colors.blue.default,
        borderColor: Colors.blue.darkened,
        borderWidth: 2,

        display: "flex",
        justifyContent: "center",
            alignItems: "center",    
    },
    timewarpButtonText: {
        fontSize: 30,
        color: "#fff"
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
    },

    contextMenu: {
        position: "absolute",
        top: "5%",
        right: "25%",

        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 10
    },
    contextMenuButton: {
        width: 40,
        height: 40,
        borderRadius: 20,

        backgroundColor: "#fff",

        borderColor: "#ddd",
        borderWidth: 2,

        display: "flex",
        justifyContent: "center",
            alignItems: "center",
    },
    contextMenuButtonText: {
        fontSize: 24
    },
    contextBtnContainer: {
        width: 140,
        padding: 4,

        backgroundColor: "#fff",

        borderColor: "#ddd",
        borderWidth: 2,
        borderRadius: 10,
        gap: 6
    },
    contextBtn: {
    }
})