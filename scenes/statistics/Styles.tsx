import { Dimensions, StyleSheet } from "react-native";
import MenuBundle from "../../styleBundles/MenuBundle";
/* Constants */
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",

        width: "100%",
        height: "100%",

        display: "flex",
        justifyContent: "center",
            alignItems: "center",

    },
    padding: {
        paddingHorizontal: 40,
        display: "flex",
        justifyContent: "center",

        width: "100%",
    },
    innerContainer: {
        width: "100%",
        flex: 5
    },
    thankYou: {
        fontFamily: "inter-black",
        fontSize: 40,
        textAlign: "center"
    },

    amountOfImagesCount: {
        fontFamily: "inter-black",
        fontSize: 80
    },
    amountOfImagesText: {
        fontSize: 24,
        fontWeight: "400",
        color: "#ccc",
        fontFamily: "manrope-light",
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
        fontWeight: "500",
    },

    disk: {
        position: "absolute",

        fontSize: 98,
        overflow: "hidden",
        zIndex: -1,
        right: -25,
        opacity: 0.4
    },

    quickCounter: {
        fontFamily: "inter-black",
        fontSize: 80
    },
    quickCounterText: {
        fontSize: 24,
        fontWeight: "400",
        color: "#ddd"
    },

    footer: {
        height: "14%",
        width: "100%",
        flex: 1,
        position: "absolute",
        bottom: 0,
        paddingHorizontal: 40,

        display: "flex",
        gap: 10
    }
})