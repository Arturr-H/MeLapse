import { Dimensions, StyleSheet } from "react-native";
import MenuBundle from "../../styleBundles/MenuBundle";

/* Constants */
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

export default StyleSheet.create({
    ...MenuBundle,

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