import { StyleSheet } from "react-native";
import { WIDTH } from "../result/Result";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    padding: {
        paddingHorizontal: 40,
        display: "flex",
        justifyContent: "center",
            alignItems: "center",

        flex: 1,
    },
    innerContainer: {
        width: "100%",
    },

    loadingContainer: {
        width: "100%",
        position: "absolute",
        bottom: 20,

        display: "flex",
        justifyContent: "center",
            alignItems: "center",
        flexDirection: "row",
        gap: 10,
    },
    loadingText: {
        fontSize: 24,
        color: "#ddd",
        fontWeight: "500"
    },

    disk: {
        position: "absolute",

        fontSize: 98,
        overflow: "hidden",
        zIndex: -1,
        right: -25,
        opacity: 0.4
    },
});
